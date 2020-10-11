var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
    flushEvery: 1000,
    name: 'berdov_com',
});


extractor.extractURLlistFromURLsequence({
    pagesCount: 13,
    reportEvery: 10000,
    flushEvery: 10000,
    prefix: 'https://www.berdov.com/',
    linkpattern: '',
    linkprefix: 'https://www.berdov.com',
    pause: 2000,
    exclude: [
        'https://www.berdov.com/[1-9][1-9]?',
        'https://www.berdov.com/sitemap/'
    ],
});
