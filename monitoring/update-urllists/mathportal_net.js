var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name: 'mathportal_net',
});


extractor.extractURLlistFromSiteRecursive({
    pause: 5000,
    root: 'http://mathportal.net/',
});
