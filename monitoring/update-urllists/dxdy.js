var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'dxdy',
});

var prefixes = [
	'http://dxdy.ru/matematika-obschie-voprosy-f1-',
	'http://dxdy.ru/analiz-i-f65-',
	'http://dxdy.ru/pomogite-reshit-razobratsya-m-f27-',
//	'',
//	'',
//	'',
];


for (var i = 0; i < prefixes.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	500,
		reportEvery: 2,
		flushEvery: 150,
		prefix:	prefixes[i],
		postfix: '0.html',
		linkpattern:	'http://dxdy.ru/topic',
		linkprefix:	'',
		pause:2000,
	});
}

