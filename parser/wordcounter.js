var fs=require('fs');

function Wordcounter(){
	this.textBuffer="";
	this.words={};
	this.wordsCount=0;
	this.wordsDifferent=0;
	this.wordm=/[^А-Яа-яЁё\-]/gm;
	this.regCyr=/[А-Яа-яЁё]/;
}

Wordcounter.prototype.addText=function(text){//TODO: найти способ избежать повторений с parse-lib
	var localWords=text.split(this.wordm);
	for(var i = 0; i < localWords.length; i++){
		var word = localWords[i];
		if(this.regCyr.test(word) && word.length > 1){
			word = word.toLowerCase();
			this.wordsCount++;
			if(this.words[word]){
				this.words[word]++;
			}else{
				this.words[word]=1;
				this.wordsDifferent++;
			}
		}
	}
}

Wordcounter.prototype.addBufferedText=function(text){
	if(this.textBuffer.length>32*1024*1024){
		this.addText(this.textBuffer);
		this.textBuffer=text;
	} else {
		this.textBuffer+=';'+text;
	}
}

Wordcounter.prototype.getJSON=function(){
	return JSON.stringify(this.words);
}

Wordcounter.prototype.writeFiles=function(filename){
	console.log('Начинаем записывать словарь...');
	this.addText(this.textBuffer);
	var json=this.getJSON();
	fs.writeFileSync(filename+'.words.json',json);

	var freqs=[];
	for(var chto in this.words){
		freqs.push([chto,this.words[chto]]);
	}

	var freqsort=function(a,b){
		return b[1]-a[1] || [-1,1][1*(b[0]<a[0])];
	}

	freqs=freqs.sort(freqsort);


	var text='';
	var html='';
	var forYaspeller='';
	for(var i=0;i<freqs.length; i++){
		text += freqs[i][0]+ ' : '+freqs[i][1]+'\r\n';
		html += '<tr><td>'+freqs[i][0]+ '</td><td>'+freqs[i][1]+'</td></tr>\n';
		forYaspeller += freqs[i][0]+';';
	}


	fs.writeFileSync(filename+'.words.txt',text);
	fs.writeFileSync(filename+'.words.yaspeller',forYaspeller);
	fs.writeFileSync(filename+'.words.html',
		'<html><head><meta charset="utf-8"/></head><body>\n'+
		'Всего слов: '+this.wordsCount+'<br/>\n'+
		'Различных слов: '+this.wordsDifferent+'<br/>\n'+
		'<table border="1" cellspacing="0" cellpadding="5">\n'+
		html+'</table></body></html>'
	);
}

module.exports.Wordcounter=Wordcounter;
