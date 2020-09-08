var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'calcs_su',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://calcs.su/',
	exclude: [
		'http://calcs.su/de/',
		/https:\/\/calcs.su\/html\/calcs\/region\/(?!khabarovsk-krai)/
	]
});
