var urllist = require('../../parser/urllist.js');
//bvf.ru - тут сплошная нумерация
var bvflinks=[];
for(var i=700/*1096635*/; i<1096646; i++){
	bvflinks.push('http://bvf.ru/forum/showthread.php?t='+i);
}
urllist.countErrorsInURLarray(bvflinks,10000/*82000*//*10000000*/,
	'<div id="posts">',
	'function insertQuote',
	{
		encoding:'win1251',
		name:'bvf',
		pause:500,
	}
);
