var urllist = require('../../parser/urllist.js');

var linksObject={};
for(var i=1; i<10; i++){
	urllist.extractURLlistFromURLsequence({
		name:	'kommersant-vrn',
		pagesCount:	32,
		reportEvery: 10,
		prefix:	'http://www.kommersant.ru/archive/news/36/2015-0'+i+'-',
		linkpattern:	'/news/',
		linkprefix:	'http://www.kommersant.ru',
		linksObject: linksObject,
	});
}
