var urllist = require('../../parser/urllist.js');
//bvf.ru - тут сплошная нумерация
var bvflinks=[];
for(var i=700/*1096635*/; i<1096646; i++){
	bvflinks.push('http://bvf.ru/forum/showthread.php?t='+i);
}
urllist.countErrorsInURLarray(bvflinks,82000/*10000000*/,
//	'<!-- / end content table -->',
//	'<!-- / thread tools menu -->',
//	'<body',
//	'jQuery.getScript(\'http://service.bvf.ru/listen/bvfmenuv2/?userid=0&securitytoken=guest\');',
	'<div id="posts">',
	'function insertQuote',
//	'</body',
	{
		encoding:'win1251',
		name:'bvf',
		pause:500,
/*		additionalDumps:[
			'bvf.1',
			'bvf.2',
		],*/
	}
);
