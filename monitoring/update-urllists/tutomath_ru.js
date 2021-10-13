var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
    flushEvery: 1000,
    name: 'tutomath_ru',
});


extractor.extractURLlistFromURLsequence({
    pagesCount: 16,
    reportEvery: 10000,
    flushEvery: 10000,
    prefix: 'https://tutomath.ru/page/',
    linkpattern: 'https://tutomath.ru/',
    linkprefix: '',
    pause: 2000,
    exclude: [
        '/category/',
        '/page/',
    ]
});
