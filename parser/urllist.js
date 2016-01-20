var fs = require('fs');
var parser = require('./parse-lib.js');
var childProcess=require('child_process');
var wordcounterProcess = childProcess.fork(__dirname+'/wordcounterProcess.js');

var globalExpression=parser.makeGlobalExpression();
var actionArray=parser.readActionArray();
var length;

var errors;
var pagesProceeded;
var pagesWithErrors;

var name="log";
var log404="";

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
}

function countErrorsInURLlist(filename,maxlength,beginFrom,endWith,options){
	var urls=parser.readJSONfromFile(filename);
	name=filename.replace(".urllist.json","").replace("urllists/",""); //Костыль, ну да ладно
	countErrorsInURLarray(urls,maxlength,beginFrom,endWith,options);
}

function normalize(text){
	return text.replace(/ё/gi,"е").replace(/\s+/gi," ");
}

function workWithGoodChunk(text,options){
	text=text.replace(/[^а-яё]{4,}/gi,";");
	if(!text.length){
		log404+=(options.url+" : целевой текст не выделен\n");
		pagesWithErrors++;
		return;
	}
	
	wordcounterProcess.send({
		type: 'newtext',
		text: text,
	});

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
function workWithChunk(text,options){
	console.error(pagesProceeded,text.length,options);
	workWithGoodChunk(text,options);
	pagesProceeded++;
	if(pagesProceeded==length){
		finishCheck();
	}
}

function finishCheck(){
	var successPages=pagesProceeded-pagesWithErrors;
	console.log("Страниц обработано успешно: "+successPages);
	console.log("Страниц обработано неуспешно: "+pagesWithErrors);
	console.log("Ошибок обнаружено: "+errors);
	console.log("Ошибок обнаружено на страницу: "+(errors/successPages));
	fs.writeFile("results/"+name+".404.log",log404);

	wordcounterProcess.on('message', function (count) {
		console.log("Словоупотреблений обработано: "+ count);
		console.log("Ошибок на 1000 словоупотреблений обнаружено: "+(errors/count*1000))
		console.error("Завершено: "+name);
	});
	wordcounterProcess.send({
		type: 'finish',
		filename: 'results/'+name,
	});
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
