var fs = require('fs');
var exec = require('child_process').exec;
var http = require('http');
var https = require('https');
var request = require('request');
var iconv = require('iconv-lite');
iconv.skipDecodeWarning = true;
//var iconvH = require('iconv');//Не встаёт, матюки малопонятны
var totalWords=0;

var words = {};
var regCyr=/[А-Яа-яЁё]/;
//var wordm=/[\s\[\].,;:?!<>\(\)&…*«»%№""'']|^|$/gm;//А то IDE смущается
var wordm=/[^А-Яа-яЁё\-]/gm;//А то IDE смущается
var tsya=/ть*ся/;
var oldTime;

function deleteOddFromSentenceArray(a){
	return a.filter(function(sentence){
			return !/^\s*$/.test(sentence) && /[А-ЯЁа-яё]/.test(sentence);
	}).map(function(sentence){
		return sentence.replace(/([\s*]{2,})/g," ").replace(/(^[^А-ЯЁа-яё]+)|([^А-ЯЁа-яё]+$)/g,"");
	});
}

function loadPage(page,pagelim,urlPrefix,urlPostfix,filename){
	if(page>pagelim){
		resultToJSON(filename+page);
		return;
	}
	var wgetList=[];
	for(var psi=0; psi<99; psi++)
		wgetList.push(urlPrefix+(page*100+psi)+urlPostfix);
	oldTime=new Date().getTime();
	exec('wget -t 100 --header="accept-encoding: identity" '+wgetList.join(' ')+'  -O - | grep -e [а-яё] | sort -u | sed -e :a -e \'s/<[^>]*>//g;/</N;//ba\'',
	{maxBuffer: 2048*1024},function(error, stdout, stderror) {
		addTextToWords(stdout);
		console.log(page);
		if(page % 10 == 0){
			resultToJSON(filename+page);
		}
		loadPage(page+1,pagelim,urlPrefix,urlPostfix,filename);
	});
}

function makeWordsEmpty(){
	words={};
}

function addTextToWords(text){
	var localWords=text.split(wordm);
	for(var i1=0; i1 < localWords.length; i1++){
		if(regCyr.test(localWords[i1]) && localWords[i1].length > 1){
			localWords[i1]=localWords[i1].toLowerCase();
			totalWords++;
			if(words[localWords[i1]]){
				words[localWords[i1]]++;
			}else{
				words[localWords[i1]]=1;
			}
		}
	}
}

function countWords(){
//	return Object.keys(words).length;
	return totalWords;
}

function resultToJSON(filename){
	var freqs=[];
	for(var chto in words){
		freqs.push([chto,words[chto]]);
	}

	var freqsort=function(a,b){
		return b[1]-a[1];
	}

	freqs=freqs.sort(freqsort);


	var rez="";
	for(var i=0;i<freqs.length; i++){
		rez+=freqs[i][0]+ " : "+freqs[i][1]+"\r\n";
	}

	fs.writeFileSync(filename+".json",JSON.stringify(words));
	fs.writeFileSync(filename+".txt",rez);
	words={};
	if(oldTime)
		console.log("На группу из 100 страниц затрачено "+((new Date().getTime()-oldTime)/60000)+" мин.");
}

function sumObjects(obj1, obj2){
//obj1 перезаписывается
	for(var chto in obj2){
		if(obj1[chto]){
			obj1[chto]+=obj2[chto];
		}else{
			obj1[chto]=obj2[chto];
		}
	}
}

function sumJSON(o,target){
	words={};
	for(var i=o.start; i<=o.finish; i+=o.step){
		var text = fs.readFileSync(o.prefix+i+o.postfix, 'utf-8');
		sumObjects(words,JSON.parse(text));
	}
	resultToJSON(target);
}

function readWordsFromJSON(filename){
	words=JSON.parse(fs.readFileSync(filename, 'utf-8'));
}

function readJSONfromFile(filename){
	return JSON.parse(fs.readFileSync(filename, 'utf-8'));
}

function bruteReplace(ih){
	for(var i=0; i<actionArray.length;i++){
		if(actionArray[i][2].test(ih))
			ih=ih.replace(actionArray[i][0],actionArray[i][1]);
	}
	return ih;
}

var actionArray;
function countReplacableInJSON(filename,log){
	
	(filename);
	var totalWords=selectReplacable();
	resultToJSON(log);
	console.log(totalWords);
}

function isReplacable(chto){
	return chto==bruteReplace(chto);
}

function readActionArray(){
	return actionArray = require('../prepareDictionary.js').actionArray;
}

function makeGlobalExpression(){
	readActionArray();
	var globalExpressionSrc=actionArray[0][0].source;
	for(var i=1; i<actionArray.length; i++){
		globalExpressionSrc+="|"+actionArray[i][0].source;
	}
	return new RegExp(globalExpressionSrc,"g");
}

function selectReplacable(){
	readActionArray();
	var totalWords=0;
	for(var chto in words){
		if(isReplacable(chto)){
			delete words[chto];
		}else{
			totalWords+=words[chto];
		}
	}
	return totalWords;
}

function setWords(o){
	words=o.words;
	totalWords=o.wordsCount;
}

/*
o:
prefix:		префикс урла, откуда качать
postfix:	постфикс урла, откуда качать
first:		номер, с которого начать
last:		номер, на котором остановиться
step:		шаг, с которым увеличивать номер
threads:	количество потоков
dest:		куда складывать (или откуда брать) файлы
*/

var absentFiles=[];
var lastSettings={};

function startDownloadTextFiles(o){
	lastSettings=o;
	var newstep=o.step*o.threads;
	o.postfix||(o.postfix='');
	for(var i=0; i<o.threads; i++){
		downloadTextFiles({
			prefix:  o.prefix,
			postfix: o.postfix,
			first:   o.first+o.step*i,
			last:    o.last,
			step:    newstep,
			dest:    o.dest,
		});
	}
}

function downloadTextFiles(o){
	if(o.first>o.last){
		return;
	}
	exec('wget --header="accept-encoding: identity" '+o.prefix+o.first+o.postfix+'  -O '+o.dest+o.first,
		{maxBuffer: 2048*1024},
		function(error, stdout, stderror) {
			console.log(o.first);
			o.first+=o.step;
			downloadTextFiles(o);
	});
}

function readFilesToSentences(o, sentencesArray){
	lastSettings=o;
	o.postfix||(o.postfix='');
	if(o.first>o.last){
		return sentencesArray;
	}
	try{
		sentencesArray=sentencesArray.concat(fs.readFileSync(o.dest+o.first+o.postfix, 'utf-8').split(/[.\r\n]/g));
	}catch(e){
		console.log("Не удалось прочесть файл "+o.dest+o.first);
		absentFiles.push(o.first);
	}
	o.first+=o.step;
	return readFilesToSentences(o, sentencesArray);
}

function makeCorpusFromFiles(o, corpusDest){
	var sentencesArray=[];
	fs.writeFileSync(
		corpusDest,JSON.stringify(
			deleteOddFromSentenceArray(
				readFilesToSentences(o, [])
			).sort()
		)
	);
}

function countErrorsInCorpus(corpusDest){
	var corpus=JSON.parse(fs.readFileSync(corpusDest, 'utf-8'));
	var errorCount=0;
	for(var i=0, il=actionArray.length; i<il; i++){
		for(var j=0, jl=corpus.length; j<jl; j++){
			var stringBefore=corpus[j];
			corpus[j]=corpus[j].replace(actionArray[0],actionArray[1]);
			if(stringBefore != corpus[j]){
				errorCount++;
			}
		}
	}
	console.log(errorCount);
}

function countErrorsInTextFileDump(o, /*ref*/errorsArray){
	var realFirst=o.first;
	readActionArray();
	var sentencesArray=[];
	sentencesArray = readFilesToSentences(o, sentencesArray);
	var totalErrorsCount=0;
	var sentencesCount=sentencesArray.length;
	for(var sentencesProcessed=0; sentencesProcessed<sentencesCount; sentencesProcessed++){
		if(!isReplacable(sentencesArray[sentencesProcessed])){
			totalErrorsCount++;
			errorsArray.push(sentencesArray[sentencesProcessed]);
		}
		if(!(totalErrorsCount%100)){
	//		console.log(totalErrorsCount);
		}
	}
	console.log("Всего ошибок: "+totalErrorsCount);
	console.log("Ошибок на файл: "+( totalErrorsCount / ( (Math.ceil(o.last+1-realFirst)) / o.step )) );
}

function repairAbsentFiles(o){
	if(!absentFiles.length){
		return;
	}
	o||(o=lastSettings);
	o.last=o.first=absentFiles[0];
	console.log("Докачиваем файл "+o.dest+o.first);
	downloadTextFiles(o);
	absentFiles.splice(0,1);
	repairAbsentFiles();
}

var thePool={maxSockets: 4096};//Из гуманитарных соображений

function getHTMLfromURL(url,callback,options){
	request.get({
		uri: url,
		encoding: null,
		followRedirects : true,
//		pool: thePool,
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(body,options);
		} else {
			options || (options = {});
			options.error=error;
			callback("",options);
		}
	});
}

function getChunkFromURL(url,callback,beginning,ending,options){
	getHTMLfromURL(url,function(body){
		body = iconv.decode(body, options.encoding || 'utf8');
	/*
		body = new Buffer(body, 'binary');
		conv = new iconvH.Iconv(options.encoding || 'utf8', 'utf8');
		body = conv.convert(body).toString();
	*/
	//	console.log(body);
		callback(
			body.substr(0,body.search(ending)).substr(body.search(beginning)),
			options
		);
	})
}


module.exports.repairAbsentFiles=repairAbsentFiles;
module.exports.countErrorsInTextFileDump=countErrorsInTextFileDump;
module.exports.startDownloadTextFiles=startDownloadTextFiles;
module.exports.downloadTextFiles=downloadTextFiles;
module.exports.loadPage=loadPage;
module.exports.sumJSON=sumJSON;
module.exports.bruteReplace=bruteReplace;
module.exports.countReplacableInJSON=countReplacableInJSON;
module.exports.readFilesToSentences=readFilesToSentences;
module.exports.makeCorpusFromFiles=makeCorpusFromFiles;
module.exports.countErrorsInCorpus=countErrorsInCorpus;
module.exports.getHTMLfromURL=getHTMLfromURL;
module.exports.getChunkFromURL=getChunkFromURL;
module.exports.readJSONfromFile=readJSONfromFile;
module.exports. makeGlobalExpression = makeGlobalExpression ;
module.exports. readActionArray = readActionArray ;

module.exports.makeWordsEmpty  =  makeWordsEmpty;
module.exports.addTextToWords  =  addTextToWords;
module.exports.resultToJSON =  resultToJSON;
module.exports. countWords = countWords ;
module.exports. setWords = setWords ;



/*
module.exports.  =  ;
module.exports.  =  ;
module.exports.  =  ;
module.exports.  =  ;
module.exports.  =  ;
*/


/* Примеры использования

var parseLib=require('./parser/parse-lib.js');

parseLib.startDownloadTextFiles({prefix:'https://ficbook.net/ajax/download_fic?fanfic_id=',postfix:'',first:1,last:313,step:100,threads:1,dest:"../../jsons/ficbook/"});
parseLib.readFilesToSentences({first:100,last:310000,step:100,threads:1,dest:"../jsons/ficbook/"},[]);
parseLib.countErrorsInCorpus('../ficbook-corpus.json');

var errors=[];
parseLib.countErrorsInTextFileDump({postfix:'',first:100001,last:131001,step:100,threads:1,dest:"../jsons/ficbook/"},errors);
parseLib.countErrorsInTextFileDump({postfix:'',first:100001,last:131001,step:100,threads:1,dest:"../jsons/habr/habr"},errors);
*/
