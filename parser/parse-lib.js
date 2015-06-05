var fs = require('fs');
var exec = require('child_process').exec;
var http = require('http');
var https = require('https');

var words = {};
var regCyr=/[А-Яа-яЁё]/;
//var divm=/<div class="text">.*?<\/div>/g;
var wordm=/[\s\[\].,;:?!<>\(\)&…*«»%№"']|^|$/gm;
var tsya=/ть*ся/;
var oldTime;

function loadPage(page,pagelim,urlPrefix,urlPostfix,filename){
	if(page>pagelim){
		resultToJSON(filename+page);
		return;
	}
	var wgetList=[];
	for(var psi=0; psi<99; psi++)
		wgetList.push(urlPrefix+(page*100+psi)+urlPostfix);
	oldTime=new Date().getTime();
//	exec('wget -t 100 --header="accept-encoding: identity" '+wgetList.join(' ')+'  -O - | sort -u | sed -e :a -e \'s/<[^>]*>//g;/</N;//ba\'',
	exec('wget -t 100 --header="accept-encoding: identity" '+wgetList.join(' ')+'  -O - | grep -e [а-яё] | sort -u | sed -e :a -e \'s/<[^>]*>//g;/</N;//ba\'',
//	exec('wget -t 100 --header="accept-encoding: identity" http://habrahabr.ru/post/{'+page+'00..'+page+'99}/  -O - | grep -e [а-яё] | sort -u | sed -e :a -e \'s/<[^>]*>//g;/</N;//ba\'',
//	exec('wget -t 100 --header="accept-encoding: identity" http://habrahabr.ru/post/'+page+'/  -O - | grep -e [а-яё] | sort -u | sed -e :a -e \'s/<[^>]*>//g;/</N;//ba\'',
//	exec('wget -t 100 --header="accept-encoding: identity" http://habrahabr.ru/post/$i/  -O - ',
	{maxBuffer: 2048*1024},function(error, stdout, stderror) {
		addTextToWords(stdout);
		console.log(page);
		if(page % 10 == 0){
			resultToJSON(filename+page);
		}
		loadPage(page+1,pagelim,urlPrefix,urlPostfix,filename);
	});
}

function addTextToWords(text){
	var localWords=text.split(wordm);
	for(var i1=0; i1 < localWords.length; i1++){
		if(regCyr.test(localWords[i1]) && localWords[i1].length > 1){
			localWords[i1]=localWords[i1].toLowerCase();
			if(words[localWords[i1]]){
				words[localWords[i1]]++;
			}else{
				words[localWords[i1]]=1;
			}
		}
	}
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
//	console.log(Object.keys(words).length)
	var totalWords=selectReplacable();
//	console.log(Object.keys(words).length)
	resultToJSON(log);
	console.log(totalWords);
}

function isReplacable(chto){
	return chto==bruteReplace(chto);
}

function selectReplacable(){
	actionArray = require('./correct/prepareDictionary.js').actionArray;
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

/*
o:
prefix:		префикс урла, откуда качать
postfix:	постфикс урла, откуда качать
first:		номер, с которого начать
last:		номер, на котором остановиться
step:		шаг, с которым увеличивать номер
threads:	количество потоков
*/

function startDownloadTextFiles(o){
	var newstep=o.step*o.threads;
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
			downloadTextFiles({
				prefix:  o.prefix,
				postfix: o.postfix,
				first:   o.first+o.step,
				last:    o.last,
				step:    o.step,
				dest:    o.dest,
			});
	});
}

function readFilesToSentences(o, sentencesArray){
	if(o.first>o.last){
		return;
	}
	sentencesArray=sentencesArray.concat(fs.readFileSync(o.dest+o.first, 'utf-8').split("."));
	o.first+=o.step;
	readFilesToSentences(o, sentencesArray);
}

module.exports.startDownloadTextFiles=startDownloadTextFiles;
module.exports.downloadTextFiles=downloadTextFiles;
module.exports.loadPage=loadPage;
module.exports.sumJSON=sumJSON;
module.exports.countReplacableInJSON=countReplacableInJSON;
