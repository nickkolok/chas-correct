var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'kpolyakov_spb_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:2000,
	root: 'http://kpolyakov.spb.ru/',
});
