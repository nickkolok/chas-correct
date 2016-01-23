var fs = require('fs');
var parser = require('./parse-lib.js');
var childProcess=require('child_process');
var wordcounterProcess = childProcess.fork(__dirname+'/wordcounterProcess.js');
var     checkerProcess = childProcess.fork(__dirname+    '/checkerProcess.js');

var zlib=require('zlib');

var globalExpression=parser.makeGlobalExpression();
var actionArray=parser.readActionArray();
var length;

var errors;
var pagesProceeded;
var pagesWithErrors;

var name="log";
var log404="";

var htmlTable='';

var dump={};

function countErrorsInURLarray(urls,maxlength,beginFrom,endWith,options){
	errors=0;
	pagesProceeded=0;
	pagesWithErrors=0;
	parser.makeWordsEmpty();
	length=Math.min(maxlength,urls.length);
	if(options && options.name){
		name=options.name;
	}
	console.log("Обрабатывается страниц: "+length);
	for(var i=0; i<length; i++){
		var newopts={};
		for(var prop in options)
			newopts[prop]=options[prop];
		newopts.url=urls[i];
		(function(i,newopts){
			setTimeout(function(){
				parser.getChunkFromURL(urls[i],workWithChunk,beginFrom,endWith,newopts);
			},(newopts.pause||100)*i);
		})(i,newopts);//Замыкание, в рот ему ноги!
	}
	checkerProcess.send({
		type:  'init',
		left:  '[^\.!?|]*',
		right: '[^\.!?|]*',
	});
	checkerProcess.on('message', function (m) {
		switch(m.type){
			case 'mistake':
				console.log(m.options.url+' : '+m.text+' : '+m.signatures);
				for(var i=0; i<m.signatures.length; i++){
					m.text = m.text.replace(m.signatures[i],'<b>' + m.signatures[i] + '</b>');
				}
				htmlTable+='<tr>'+
					'<td><a href="'+m.options.url+'">'+m.options.url.replace(/^https+\:\/\//,'')+'</a></td>'+
					'<td>'+m.text+'</td>'+
					'<td>'+m.signatures.join(' ; ')+'</td>'+
				'</tr>';
			break;
			case 'quantity':
				printNumbers(m.quantity);
			break;
		}
	});
}

function countErrorsInURLlist(filename,maxlength,beginFrom,endWith,options){
	var urls=parser.readJSONfromFile(filename);
	name=filename.replace(".urllist.json","").replace("urllists/",""); //Костыль, ну да ладно
	countErrorsInURLarray(urls,maxlength,beginFrom,endWith,options);
}

function workWithGoodChunk(text,options){
//	text=text.replace(/[^а-яё]{4,}/gi,";");
	text=text.replace(/<[^>]*>/gi,"|").replace(/<\s+>/g," ");
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
	console.error(pagesProceeded,text.length,options);
//	dump[options.url]=text;
	workWithGoodChunk(text,options);
	pagesProceeded++;
	if(pagesProceeded==length){
		finishCheck();
	}
}

var wordsCount=0;

function finishCheck(){
	fs.writeFile("results/"+name+".404.log",log404);

	wordcounterProcess.on('message', function (count) {
		wordsCount=count;
		checkerProcess.send({type:'finish'});
	});
	wordcounterProcess.send({
		type: 'finish',
		filename: 'results/'+name,
	});

//	fs.writeFile("results/"+name+".dump.json",JSON.stringify(dump));
/*
	zlib.deflate(JSON.stringify(dump), function(err, buffer) {
		if (!err) {
			console.log(buffer.length);
		}
	});
*/
}

function printNumbers(mistakes){
	function bothLog(text){
		console.log(text);
		html+='<br/>'+text;
	}

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
		'<tr><th>Адрес</th><th>Контекст</th><th>Сигнатуры</th></tr>'+
		htmlTable+
		'</table></body></html>';
	fs.writeFileSync('results/'+name+'.report.html',html);
	console.error("Завершено: "+name);

}


module.exports.countErrorsInURLlist  = countErrorsInURLlist ;
module.exports.countErrorsInURLarray = countErrorsInURLarray;
