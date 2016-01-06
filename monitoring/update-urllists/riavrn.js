var urllist = require('../../parser/urllist.js');

var rubrics=[
	'accidents',
	'society',
	'culture',
	'sport',
	'gov',
	'economy',
	'afisha/movie',
	'opinions',
//	'reporter',
//	'news',
];
var linksObject={};
for(var i=0; i<rubrics.length; i++){
	urllist.extractURLlistFromURLsequence({
		name:	'riavrn',
		pagesCount:	300,
		reportEvery: 50,
		prefix:	'http://m.riavrn.ru/'+rubrics[i]+'/?load=y&PAGEN_1=',
		linkpattern:	'/'+rubrics[i]+'/',
		linkprefix:	'http://m.riavrn.ru',
		linksObject: linksObject,
	});
}
