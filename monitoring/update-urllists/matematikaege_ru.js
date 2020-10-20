var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
    flushEvery: 10000,
    name: 'matematikaege_ru',
});


extractor.extractURLlistFromSiteRecursive({
    pause: 2000,
    root: 'http://matematikaege.ru/',
    exclude: [
        'http://matematikaege.ru/sitemap.xml', //карта сайта в url
        'http://matematikaege.ru/inzhenernyj-kalkulyator', //калькулятор
        'http://matematikaege.ru/zadachi', //дублируются в самих задачах
        'http://matematikaege.ru/category',
    ]
});
