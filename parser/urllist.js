var fs = require('fs');
var parser = require('./parse-lib.js');

var globalExpression=parser.makeGlobalExpression();
var actionArray=parser.readActionArray();
var length;

var errors;
var pagesProceeded;

function countErrorsInURLarray(urls,maxlength,beginFrom,endWith){
	errors=0;
	pagesProceeded=0;
	length=Math.min(maxlength,urls.length);
	console.log("Обрабатывается страниц: "+length);
	for(var i=0; i<length; i++){
		parser.getChunkFromURL(urls[i],workWithChunk,beginFrom,endWith,{url:urls[i]});
	}
}

function countErrorsInURLlist(filename,maxlength,beginFrom,endWith){
	var urls=parser.readJSONfromFile(filename);
	countErrorsInURLarray(urls,maxlength,beginFrom,endWith);
}

function normalize(text){
	return text.replace(/ё/gi,"е").replace(/\s+/gi," ");
}

function workWithChunk(text,options){
	pagesProceeded++;
	if(pagesProceeded==length){
		finishCheck();
		return;
	}
	text=text.replace(/[^а-яё]{4,}/gi,";");
//	console.log(text);
	if(!text.length){
		console.log(options.url+" : целевой текст не выделен");
		return;
	}
	var possibleMistakes=text.match(globalExpression);
	if(!possibleMistakes){
		return;
	}

	for(var i=0; i<possibleMistakes.length; i++){
		var buf=possibleMistakes[i];
		for(var j=0; j<actionArray.length; j++){
			buf=buf.replace(actionArray[j][0],actionArray[j][1]);
		}
		if(normalize(buf) != normalize(possibleMistakes[i])){
			console.log(options.url+" : "+possibleMistakes[i]);
			errors++;
		}
	}
}

function finishCheck(){
	console.log("Ошибок обнаружено: "+errors);
	console.log("Ошибок обнаружено на страницу: "+(errors/length));
}

module.exports.countErrorsInURLlist =countErrorsInURLlist ;
module.exports.countErrorsInURLarray=countErrorsInURLarray;
