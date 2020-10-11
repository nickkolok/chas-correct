var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name: 'matemonline_com',
});


extractor.extractURLlistFromURLsequence({
	pagesCount:	93,
	reportEvery: 10000,
	flushEvery: 10000,
	prefix: 'https://matemonline.com/page/',
	linkpattern: '//matemonline.com/',
	linkprefix:	'https:',
    pause: 2000,
    exclude: [
        'https://matemonline.com/2009/',
        'https://matemonline.com/2010/0[1-5]/',
        '/c?%25d'
    ],
});
