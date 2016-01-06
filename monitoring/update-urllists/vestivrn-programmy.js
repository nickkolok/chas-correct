var urllist = require('../../parser/urllist.js');

urllist.extractURLlistFromURLsequence({
	name:	'vestivrn-programmy',
	pagesCount:	100,
	prefix:	'http://vestivrn.ru/programmy?page=',
	linkpattern:	'/programmy/',
	linkprefix:	'http://vestivrn.ru',
});
