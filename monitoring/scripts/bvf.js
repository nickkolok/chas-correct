var urllist = require('../../parser/urllist.js');
//bvf.ru - тут сплошная нумерация
var bvflinks=[];
for(var i=700; i<3700; i++){
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
		//additionalDumps:['abireg.1','abireg.2','abireg.3','abireg.4','abireg.5'],
	}
);
