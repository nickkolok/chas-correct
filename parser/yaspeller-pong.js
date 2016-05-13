var fs = require('fs');
var parser = require('./parse-lib.js');
var iconv = require('iconv-lite');
const child_process = require('child_process');

//var actionArray = require('../prepareDictionary.js').actionArray;

var parser = require('./parse-lib.js');
parser.readActionArray();

function prepareYaspellerFile(o){
	fs.writeFileSync(
		o.filename+'.words.yaspeller.replaced',
		parser.bruteReplace(
			fs.readFileSync(o.filename+'.words.yaspeller','utf8')
		)
	);
}

function getYaspellerJSON(callback,o){
	try{
		child_process.execSync(
			'../node_modules/.bin/yaspeller '+
				o.filename+'.words.yaspeller.replaced '+
				'--by-words --ignore-capitalization --report json '+
				'--dictionary known-words.json'
		);
	} catch(e){
		// А наплевать, оно всегда код ошибки возвращает, если есть незнакомые слова
	}
	callback(JSON.parse(fs.readFileSync('./yaspeller_report.json','utf8'))[0][1],o);
	//parser.getHTMLfromURL(encodeURI('http://speller.yandex.net/services/spellservice.json/checkText?options=512&text='+string),proceedAnswer,0);
	//'синхрафазатрон+в+дубне+в+-+общем+хабр+шейдер'
	//parser.getHTMLfromURL(encodeURI('https://languagetool.org:8081/?language=ru-RU&text=синхрафазатрон+в+дубне+во-общем+хабр+шейдер'),proceedAnswer,0);
}

function getUnknownWordsList(o){
	prepareYaspellerFile(o);
	getYaspellerJSON(writeUnknownWords,o);
}

function getJSONwithCounts(o){
	return JSON.parse(fs.readFileSync(o.filename+'.words.json','utf8'));
}


function writeUnknownWords(array,o){
	var data=array.data;
	var text='';
	var counts=getJSONwithCounts(o);

	for(var i=0; i<data.length; i++){
		data[i].count=counts[data[i].word];
	}
	data=data.sort(function(a,b){
		return b.count-a.count;
	});

	for(var i=0; i<data.length; i++){
		if(data[i].code==1){
			text += data[i].word + '\t' + data[i].count + '\r\n';
		}
	}

	console.log(o.filename+'.words.unknown.txt');
	fs.writeFileSync(
		o.filename+'.words.unknown.txt',
		text
	);
}

module.exports.getUnknownWordsList=getUnknownWordsList;








/*
getYaspellerJSON(console.log,{name:'matematikalegko'});

function proceedAnswer(buffer){
	var text = iconv.decode(buffer, 'utf8');
	var json=JSON.parse(text);
	console.log(json);
}
*/

