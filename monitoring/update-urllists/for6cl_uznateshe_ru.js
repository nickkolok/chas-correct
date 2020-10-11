var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name: 'for6cl_uznateshe_ru',
});


extractor.extractURLlistFromURLsequence({
	pagesCount:	7,
	reportEvery: 10000,
	flushEvery: 10000,
	prefix: 'http://www.for6cl.uznateshe.ru/sitemap/?pg=',
	linkpattern: 'http://www.for6cl.uznateshe.ru/',
	linkprefix:	'',
    pause: 2000,
    exclude: [
        'http://www.for6cl.uznateshe.ru/sitemap/',
        /http:\/\/www.for6cl.uznateshe.ru\/index.php\?page_id=/,
        'http://www.for6cl.uznateshe.ru/category/'
    ],
});
