var urllist = require('../../parser/urllist.js');
//bvf.ru - тут сплошная нумерация
var bvflinks=[];
for(var i=0; i<6000; i++){
	bvflinks.push('http://bvf.ru/forum/showthread.php?t='+i);
}
urllist.countErrorsInURLarray(bvflinks,100000,
//	'<!-- / end content table -->',
//	'<!-- / thread tools menu -->',
	'<body',
	'</body',
	{
		encoding:'win1251',
		name:'bvf',
		pause:500,
		additionalDumps:[
			'bvf.1',
			'bvf.2',
		],
	}
);
