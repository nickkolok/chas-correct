var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
    flushEvery: 10000,
    name: 'matemonline_com',
});


extractor.extractURLlistFromSiteRecursive({
    pause: 2000,
    root: 'https://matemonline.com/',
    exclude: [
        'https://matemonline.com/page/'
    ],
});
