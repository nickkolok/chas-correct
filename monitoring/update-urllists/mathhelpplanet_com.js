var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'mathhelpplanet_com',
});

var prefixes = require('../urllists/mathhelpplanet_com__meta.urllist.json');


for (var i = 0; i < prefixes.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	prefixes[i] + '#',
		postfix: '',
		linkpattern:	'./viewtopic.php',
		linkprefix:	'http://mathhelpplanet.com/',
		pause:20000,
	});
}

