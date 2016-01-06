var urllist = require('../../parser/urllist.js');

urllist.extractURLlistFromURLsequence({
	name:	'vrntimes',
	pagesCount:	1500,
	prefix:	'http://vrntimes.ru/frontpage?page=',
	linkpattern:	'/articles/',
	linkprefix:	'http://vrntimes.ru/print',
});
