var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'matematikalegko',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'https://matematikalegko.ru/',
});
