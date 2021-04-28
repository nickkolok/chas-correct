var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
    flushEvery: 2000,
    name: 'moe-online_ru',
});


extractor.extractURLlistFromURLsequence({
    pagesCount: 1000,
    reportEvery: 2000,
    flushEvery: 2000,
    prefix: 'https://moe-online.ru/news?page=',
    linkpattern: '/news/',
    linkprefix: 'https://moe-online.ru',
    pause: 1000,
    exclude: [
        '/news?page=',
        /\/news\/reporter$/,
        /\/news\/byd-v-kurse$/,
        /\/news\/incidents$/,
        /\/news\/city$/,
        /\/news\/society$/,
        /\/news\/news-partner$/,
        /\/news\/people$/,
        /\/news\/weather$/,
        /\/news\/intervyu$/,
        /\/news\/transport$/,
        /\/news\/control$/,
        /\/news\/money$/,
        /\/news\/ecology$/,
        /\/news\/sport$/,
        /\/news\/culture$/,
        /\/news\/goroskop$/,
        /\/news\/first-person$/,
        /\/news\/books$/,
        /\/news\/city\/auto-news$/
    ]
});
