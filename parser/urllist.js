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
		parser.getChunkFromURL(urls[i],workWithChunk,beginFrom,endWith,newopts);
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
	var successPages=pagesProceeded-pagesWithErrors;
	console.log("Страниц обработано успешно: "+successPages);
	console.log("Страниц обработано неуспешно: "+pagesWithErrors);
	console.log("Ошибок обнаружено: "+mistakes);
	console.log("Ошибок обнаружено на страницу: "+(mistakes/successPages));
	console.log("Словоупотреблений обработано: "+ wordsCount);
	console.log("Ошибок на 1000 словоупотреблений обнаружено: "+(mistakes/wordsCount*1000))
	console.error("Завершено: "+name);
}


function extractURLlistFromURLsequence(o){
	var linksObject=o.linksObject || {};
	var pagesCount=o.pagesCount||5000;
	var pagesParsed=0;
	
	for(var i=0; i<pagesCount; i++){
		parser.getHTMLfromURL(o.prefix+i+(o.postfix||""),getUrls,i);
	}

	var linkRegExp=new RegExp('<a href="'+o.linkpattern+'[^"#]+',"g"); 
	function getUrls(html,i){
		var urlsOnPage=(''+html).match(linkRegExp);
		if(urlsOnPage){
			for(var j=0; j<urlsOnPage.length; j++){
				linksObject[urlsOnPage[j].replace('<a href="',o.linkprefix)]=0;
			}
		}
		pagesParsed++;
		if(pagesParsed==pagesCount){
			fs.writeFileSync("urllists/"+o.name+".urllist.json",JSON.stringify(Object.keys(linksObject)));
		} else if(!(i%(o.reportEvery||20))){
			console.log(i);
		}
	}
	return linksObject;
}

module.exports.extractURLlistFromURLsequence = extractURLlistFromURLsequence;

module.exports.countErrorsInURLlist  = countErrorsInURLlist ;
module.exports.countErrorsInURLarray = countErrorsInURLarray;
