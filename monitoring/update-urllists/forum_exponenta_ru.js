var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'forum_exponenta_ru',
	stripSid: true,
});

var prefixes = [
	'http://forum.exponenta.ru/forum-f6-',
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
		linkpattern:	'http://forum.exponenta.ru/topic-',
		linkprefix:	'',
		pause:2000,
	});
}

