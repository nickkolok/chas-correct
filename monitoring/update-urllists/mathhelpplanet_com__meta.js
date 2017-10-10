var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'mathhelpplanet_com__meta',
});

var prefixes = [
	'http://mathhelpplanet.com/viewforum.php?f=9',
	'http://mathhelpplanet.com/viewforum.php?f=17',
	'http://mathhelpplanet.com/viewforum.php?f=49',
//	'',
];


for (var i = 0; i < prefixes.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	prefixes[i] + '#',
		postfix: '',
		linkpattern:	'./viewforum.php',
		linkprefix:	'http://mathhelpplanet.com/',
		pause:5000,
	});
}

