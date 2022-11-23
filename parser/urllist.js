var fs = require('fs');
var mkdirp = require('mkdirp');
var parser = require('./parse-lib.js');
var dumpSqliteWrapper=require('./dumpSqliteWrapper.js');
var childProcess=require('child_process');
var zlib=require('zlib');
var wordcounterProcess = childProcess.fork(__dirname+'/wordcounterProcess.js');
var     checkerProcess = childProcess.fork(__dirname+   '/checkerBalancer.js');


var dateRelative=1453576000000-40*1000; //Магическая константа, чтобы время в дампе меньше места занимало

var globalExpression=parser.makeGlobalExpression();
var actionArray=parser.readActionArray();
var length;

var errors;
var pagesProceeded;
var pagesWithErrors;

var name="log";
var log404="";

var htmlTable=[];

var requestsSent=0;
var dumper;

function getURLfromDumpOrHttp(beginFrom,endWith,newopts){
	if (newopts.nodumpuse) {
		// Иногда правда быстрее скачать, чем искать на винте
		newopts.time=Date.now();
		setTimeout(function(){
			parser.getChunkFromURL(newopts.url,workWithChunk,beginFrom,endWith,newopts);
		},(newopts.pause||100)*requestsSent);
		requestsSent++;
		return;
	}
	dumper.extractURL(
		newopts.url,
		function(rows){ //Есть такое в дампе
			newopts.fromDump=1;
			newopts.time=rows[0].time;
			//console.log(rows[0].content);
			workWithChunk(rows[0].content,newopts);
		},
		function(){ //Нет такого в дампе
			newopts.time=Date.now();
			setTimeout(function(){
				console.log('Запрашиваем с сервера:  ' + newopts.url)
				parser.getChunkFromURL(newopts.url,workWithChunk,beginFrom,endWith,newopts);
			},(newopts.pause||100)*requestsSent);
			requestsSent++;
		}
	);
}

function countErrorsInURLarray(urls,maxlength,beginFrom,endWith,options){
	options.falsepositives = [];
	try {
		options.falsepositives = require(process.cwd() + "/falsepositives/" + options.name + ".js");
		console.log('Загружен файл со списком ложных срабатываний');
	}
	catch(e) {
		// console.log(e);
		// и фиг бы с ним
	}

	errors=0;
	pagesProceeded=0;
	pagesWithErrors=0;
	dumper = new dumpSqliteWrapper({filename:'dumps/'+options.name+'.sqlite'});
	length=Math.min(maxlength,urls.length);
	if(options && options.name){
		name=options.name;
	}
	console.log("Обрабатывается страниц: "+length);
	checkerProcess.send({
		type:  'init',
		left:  '[^\.!?|]*',
		right: '[^\.!?|]*',
	});
	checkerProcess.on('message', function (m) {
		switch(m.type){
			case 'mistake':
				var url = m.options.url;
				try{
					url = decodeURI(url);
				}catch(e){
					console.log('Unable to decode URI:');
					console.log(url);
					console.error(e);
				}
				console.log(url+(m.options.fromDump?' (cached)':'')+' : '+m.text+' : '+m.signatures);
				for(var i=0; i<m.signatures.length; i++){
					m.text = m.text.replace(m.signatures[i],'<b>' + m.signatures[i] + '</b>');
				}
				htmlTable.push(
					'<td><a href="'+m.options.url+'">'+url.replace(/^https+\:\/\//,'')+'</a></td>'+
					'<td>'+m.text+'</td>'+
					'<td>'+m.signatures.join(' ; ')+'</td>'+
					'<td>'+m.correct.join(' ; ')+'</td>'+
					'<td>'+new Date(m.options.time).toLocaleString()+'</td>'
				);
			break;
			case 'quantity':
				printNumbers(m.quantity);
			break;
		}
	});

	// If you don't do this, then the script gets stuck while trying to get pages from cache
	// Shuffling the URLs array allows to spliy the resources between new pages (which neednetwork) and old pages (which need HDD)
	if(!options.noshuffle){
		urls.sort(()=>(Math.random()>0.61?1:-1));
	}

	for(var i=0; i<length; i++){
		var newopts={};
		for(var prop in options)
			newopts[prop]=options[prop];
		newopts.url=urls[i];
		newopts.i=i;
		getURLfromDumpOrHttp(beginFrom,endWith,newopts);
	}
}

function countErrorsInURLlist(filename,maxlength,beginFrom,endWith,options){
	var urls=parser.readJSONfromFile(filename);
	name=filename.replace(".urllist.json","").replace("urllists/",""); //Костыль, ну да ладно
	countErrorsInURLarray(urls,maxlength,beginFrom,endWith,options);
}

function workWithGoodChunk(text,options){
//	console.log(text);
//	text=text.replace(/[^а-яё]{4,}/gi,";");
	options.falsepositives.map(function(t){
		text=text.replace(t, " | ");
		text=text.split(t).join(" | ");
	});
	text=text
		.replace(/<[^>]*>/gi,"|")
		.replace(/<\s+>/g," ")
		.replace(/&quot;/g,"\"")
		.replace(/\s+/g," ")
		.replace(/&nbsp;/g," ")
		.replace(/&#160;/g," ")
		.replace(/[^А-Яа-яЁё-]([^А-Яа-яЁё]{8,})[^А-Яа-яЁё-]/g," | ")
		//.replace(/<\/?[^А-Яа-яЁё>]>/g,"|")
		.replace(/́/g, "") // Ударение
		.replace(/̀/g, "") // Ударение побочное
		.replace(/­/g, "") // Мягкий перенос
		.replace(/\s+/g," ")
		.trim()
		;
	options.falsepositives.map(function(t){
		text=text.replace(t, " | ");
		text=text.split(t).join(" | ");
	});
	if(!options.fromDump && !options.nodumpuse && text){
		dumper.queueURL(
			options.url,
			Math.round((Date.now()-dateRelative)/60000),//С точностью до минут и фиксированным смещением - чтобы меньше места занимало
			text
		);
	}
	if(!text.length){
		log404+=(options.url+" : целевой текст не выделен\n");
		pagesWithErrors++;
		return;
	}

	wordcounterProcess.send({
		type: 'newtext',
		text: text,
	});
	checkerProcess.send({
		type:    'checktext',
		text:    text,
		options: options,
	});
}

function workWithChunk(text,options){
//	console.error(pagesProceeded+1,text.length,options);
	workWithGoodChunk(text,options);
	pagesProceeded++;
	if(options.reportEvery && (pagesProceeded % options.reportEvery) == 0) {
		console.log(
			'Обработано ' + pagesProceeded + ' из ' + length +
			' (' + Math.round(pagesProceeded/length*10000)/100 + '%)'
		);
	}
	if(pagesProceeded==length){
		var madeDir = mkdirp.sync('results/' + name);
		if(madeDir)
			console.log('Была создана директория: ' + madeDir);
		finishCheck();
	}
}

var wordsCount=0;

function finishCheck(){
	fs.writeFile("results/"+name+'/'+name+".404.log",log404,()=>{});
	dumper.flushQueue();

	wordcounterProcess.on('message', function (count) {
		wordsCount=count;
		checkerProcess.send({type:'finish'});
	});
	wordcounterProcess.send({
		type: 'finish',
		filename: 'results/'+name+'/'+name,
	});
}

function printNumbers(mistakes){
	function bothLog(text){
		console.log(text);
		html+='<br/>'+text;
	}

	htmlTable.sort(); //Чтобы урлы стояли хотя бы приблизительно по алфавиту!
	htmlTable=htmlTable.map(function(row,i){
		return '<tr>' + '<td>' + (i+1) + '</td>' + row + '</tr>';
	});

	var html='<html><head><meta charset="utf-8"/></head><body>';
	var successPages=pagesProceeded-pagesWithErrors;
	bothLog("Страниц обработано успешно: "+successPages);
	bothLog("Страниц обработано неуспешно: "+pagesWithErrors);
	bothLog("Ошибок обнаружено: "+mistakes);
	bothLog("Ошибок обнаружено на страницу: "+(mistakes/successPages));
	bothLog("Словоупотреблений обработано: "+ wordsCount);
	bothLog("Ошибок на 1000 словоупотреблений обнаружено: "+(mistakes/wordsCount*1000));
	bothLog("В среднем одна ошибка на "+(wordsCount/mistakes)+" словоупотреблений");
	html+='<table cellpadding="5" cellspacing="0" border="1">'+
		'<tr><th>№</th><th>Адрес</th><th>Контекст</th><th>Сигнатуры</th><th>Исправлено на</th><th>Обновлено</th></tr>'+
		htmlTable.join('')+
		'</table></body></html>';
	fs.writeFileSync('results/'+name+'/'+name+'.report.html',html);
	console.error("Завершено: "+name);
	setTimeout(process.exit,10000);
}


module.exports.countErrorsInURLlist  = countErrorsInURLlist ;
module.exports.countErrorsInURLarray = countErrorsInURLarray;
