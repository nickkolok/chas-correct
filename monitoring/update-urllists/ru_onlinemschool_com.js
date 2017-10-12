var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'ru_onlinemschool_com',
});


extractor.extractURLlistFromSiteRecursive({
	pause:1000,
	root: 'http://ru.onlinemschool.com/',
});
