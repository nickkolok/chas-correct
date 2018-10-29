var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'alexlarin_net',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://alexlarin.net/',
});
