var urllist = require('../../parser/urllist.js');

urllist.extractURLlistFromURLsequence({
	name:	'vestivrn-novosti',
	pagesCount:	5000,
	prefix:	'http://vestivrn.ru/novosti?page=',
	linkpattern:	'/novosti/',
	linkprefix:	'http://vestivrn.ru',
});
