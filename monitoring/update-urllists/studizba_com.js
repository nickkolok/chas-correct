var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'studizba_com',
});


extractor.extractURLlistFromSiteRecursive({
	pause:2000,
	root: 'https://studizba.com/lectures/47-matematika/',
});
