var fs=require('fs');
var zlib = require('zlib');



var words=JSON.parse(fs.readFileSync('results/vrntimes.words.json','utf8'));
var freqs=[];
for(var w in words){
	if(w.length>3){
		freqs.push([w,(w.length-3)*words[w]]);
	}
}
freqs=freqs.sort(function(a,b){return b[1]-a[1]});

//var alphabet='ёйцукенгшщзхъфывапролджэячсмитьбю'.split('');//чуть ли не лучше, чем по частотам
  var alphabet='оаеинтрслвкпмудяыьзбгйчюхжшцщфэъё'.split('');//.reverse();

var morealphabet=('оаеинтрслвкпмудяыьзбгйчюхжшцщфэъё'+'qwertyuiopasdghjklzxcvbnm1234567890').split('');;

var dict=[];
for(var i=0; i<alphabet.length; i++){
	delete words[freqs[i][0]];
	dict.push([new RegExp(freqs[i][0],'g'),'<'+alphabet[i]+'/']);
	dict.push([new RegExp(freqs[i][0].substr(0,1).toUpperCase()+freqs[i][0].substr(1),'g'),'<'+alphabet[i].toUpperCase()+'/']);
}

freqs=[];
for(var w in words){
	if(w.length>4){
		freqs.push([w,(w.length-4)*words[w]]);
	}
}
freqs=freqs.sort(function(a,b){return b[1]-a[1]});

for(var i=0; i<alphabet.length*morealphabet.length; i++){
	delete words[freqs[i][0]];
	dict.push([
		new RegExp(freqs[i][0],'g'),
		'<' + alphabet[Math.floor(i/morealphabet.length)] + morealphabet[i%morealphabet.length] + '/'
	]);
	dict.push([
		new RegExp(freqs[i][0].substr(0,1).toUpperCase()+freqs[i][0].substr(1),'g'),
		'<' + alphabet[Math.floor(i/morealphabet.length)].toUpperCase() + morealphabet[i%morealphabet.length] + '/'
	]);
}



function replaceRegular(text){
	for(var i=0; i<dict.length; i++){
		text=text.replace(dict[i][0],dict[i][1]);
	}
	return text;
}


console.log(JSON.stringify(dict).length);


var dump=JSON.parse(fs.readFileSync('results/vrntimes.dump.json','utf8'));

for(var url in dump){
	dump[url] = deflate(dump[url]);
}

function deflate(text){
	text = text
		.replace(/\s+/g,' ')
		.replace(/<div/g,"<d").replace(/<\/div>/g,"</d>")
		.replace(/<strong/g,"<g").replace(/<\/strong>/g,"</g>")
		.replace(/<em/g,"<e").replace(/<\/em>/g,"</e>")
		.replace(/<header/g,"<h").replace(/<\/header>/g,"</h>")
		.replace(/<img/g,"<m").replace(/<\/img>/g,"</m>")
		.replace(/<m\ssrc=/g,"<m")
		.replace(/width=/g,"w=")
		.replace(/height=/g,"h=")
		.replace(/class=/g,"c=")
		.replace(/title=/g,"t=")
		.replace(/id=/g,"i=")
		.replace(/<a\shref=/g,"<m")
/*
		.replace(/области/g,"<о/").replace(/Области/g,"<О/")
		.replace(/воронежской/g,"<в/").replace(/Воронежской/g,"<В/")
		.replace(/рублей/g,"<р/").replace(/Рублей/g,"<Р/")
		.replace(/только/g,"<т/").replace(/Только/g,"<Т/")
		.replace(/воронежа/g,"<ж/").replace(/Воронежа/g,"<Ж/")
		.replace(/которые/g,"<к/").replace(/Которые/g,"<К/")
		.replace(/что/g,"<ч/").replace(/Что/g,"<Ч/")
		.replace(/областной/g,"<й/").replace(/Областной/g,"<Й/")
*/
		;
		return replaceRegular(text);
}

var rez='';
for(var url in dump){
	rez+="'"+url+"':'"+dump[url].replace(/'/g,"\\'")+"',";
}


zlib.gzip(/*JSON.stringify(dump)*/rez, function(err, buffer) {
	if (!err) {
		console.log(buffer.length);
	}
});

