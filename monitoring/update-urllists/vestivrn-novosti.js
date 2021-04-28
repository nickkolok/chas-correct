var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
    flushEvery: 2000,
    name: 'vestivrn-novosti',
});

extractor.extractURLlistFromURLsequence({
    pagesCount: 500,
    reportEvery: 2000,
    flushEvery: 2000,
    prefix: 'https://vestivrn.ru/news/page/',
    linkpattern: 'https://vestivrn.ru/news/',
    linkprefix: '',
    pause: 2000,
    exclude: [
        '/page/',
        /\/\d*\/\d*\/\d*\/$/
    ]
});
