var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'schoolmath_rf',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://xn--80aaaaxtjfdlchl5dd8f7cwc.xn--p1ai/',
});
