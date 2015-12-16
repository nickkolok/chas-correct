var urllist = require('./urllist.js');
var parser  = require('./parse-lib.js');
var request = require('request');
var fs = require('fs');


//36on.ru - удобнее с мобильной версии
//urllist.countErrorsInURLlist('m36on.json',1000,"<div class='mobile_title l-page__content text'>","<div class='share_block'>");

//urllist.countErrorsInURLlist('abireg2.urllist.json',10000,'<td class=news>','<div class=print>');
/*
var abireglinks=[]
for(var i=3; i<50585; i++){
	abireglinks.push('http://www.abireg.ru/n_'+i+'.html');
}
urllist.countErrorsInURLarray(abireglinks,100000,'<td class=news>','<div class=print>');

*/

//urllist.countErrorsInURLlist('abireg.urllist.json',1000,'Комментарии на Abireg.ru','Комментарии на Facebook.com');//Не пашет
//urllist.countErrorsInURLlist('bloknot.urllist.json',100000,'<div id="social-top"','<div id="social-bottom"');

//urllist.countErrorsInURLlist('bloknot-voronezh.urllist.json',100,'<body>','</body>');
//urllist.countErrorsInURLlist('moe-online.urllist.json',1000000,'<li id="toc">','<div id="orphus1" title="Система Orphus">');
//urllist.countErrorsInURLlist('kp.urllist.json',1000000,'<body','</body>');
//urllist.countErrorsInURLlist('region.kp.urllist.json',1000000,'a_leftcol','a_broadcast'/*'<!-- Блок подписки - НАЧАЛО -->'*/);
urllist.countErrorsInURLlist('region.kp.urllist.json',500000000,'<body','</body>');
//urllist.countErrorsInURLlist('vrn.kp_daily.urllist.json',1000000,'<body','</body>');
//urllist.countErrorsInURLlist('vrn.kp_daily.urllist.json',1000000,'main-article_title','see-also-container');

/*
var links=[];
//for(var i=2237000; i<2240000; i++){
//	links.push('http://www.vrn.kp.ru/online/news/'+i+'/');
for(var i=47000; i<50585; i++){
	links.push('http://www.abireg.ru/n_'+i+'.html');
}
console.log(JSON.stringify(links));
*/

/*
var linksObject={};
var pagesCount=2452;

for(var i=1; i<pagesCount; i++){
	parser.getHTMLfromURL("http://bloknot-voronezh.ru/?PAGEN_1="+i,bloknot_voronezh,i);
}

function bloknot_voronezh(html,i){
	var urlsOnPage=html.match(/<a href="\/news\/[^"#]+/g);
	for(var j=0; j<urlsOnPage.length; j++){
		linksObject[urlsOnPage[j].replace('<a href="','http://bloknot-voronezh.ru')]=0;
	}
	if(i==pagesCount-1){
		fs.writeFileSync("bloknot-voronezh.urllist.json",JSON.stringify(Object.keys(linksObject)));
	} else if(!(i%20)){
		console.log(i);
	}
}
*/


/*
<a href="/news/
http://bloknot-voronezh.ru/?PAGEN_1=7


<li id="toc">
<div id="orphus1" title="Система Orphus">


<div class="article_page">
<a href="/" class="main_back">


*/
/*
//Этим выдирать ссылки из выдачи гугля

var links=document.getElementsByTagName('cite');
var urls=[];
for(var i=0; i<links.length; i++){urls.push(links[i].innerHTML)};
urls;

*/

/*
//То же, но если ссылки с многоточиями

var links=document.getElementsByClassName('r');
var urls=[];
for(var i=0; i<links.length; i++){urls.push(links[i].getElementsByTagName('a')[0].href)}
console.log(JSON.stringify(urls));

*/
