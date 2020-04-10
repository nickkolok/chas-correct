var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name:	'ru-math-wikia-com',
});

var sitemaps = [
	'https://math.wikia.org/ru/wiki/%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:AllPages?from=-1_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29&to=%D0%90%D1%82%D0%BE%D0%BC_%28%D0%BB%D0%BE%D0%B3%D0%B8%D0%BA%D0%B0%29',
	'https://math.wikia.org/ru/wiki/%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:AllPages?from=%D0%90%D1%84%D1%84%D0%B8%D0%BD%D0%BD%D0%BE%D0%B5_%D0%BF%D0%BE%D0%B4%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%80%D0%B0%D0%BD%D1%81%D1%82%D0%B2%D0%BE&to=%D0%9A%D0%BE%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%BD%D0%BE%D1%81%D1%82%D1%8C',
	'https://math.wikia.org/ru/wiki/%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:AllPages?from=%D0%9A%D0%BE%D1%80%D0%B5%D0%BD%D1%8C_%28%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B8%D1%8F%29&to=%D0%9F%D0%BE%D0%B2%D0%B5%D1%80%D1%85%D0%BD%D0%BE%D1%81%D1%82%D1%8C_%D0%9F%D0%BE%D0%BD%D1%82%D1%80%D1%8F%D0%B3%D0%B8%D0%BD%D0%B0',
	'https://math.wikia.org/ru/wiki/%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:AllPages?from=%D0%9F%D0%BE%D0%B3%D1%80%D0%B5%D1%88%D0%BD%D0%BE%D1%81%D1%82%D1%8C_%D0%B8%D0%B7%D0%BC%D0%B5%D1%80%D0%B5%D0%BD%D0%B8%D1%8F&to=%D0%A2%D0%B5%D0%BD%D0%B7%D0%BE%D1%80',
	'https://math.wikia.org/ru/wiki/%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:AllPages?from=%D0%A2%D0%B5%D0%BD%D0%B7%D0%BE%D1%80%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5&to=%E2%88%921_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29',
	'https://math.wikia.org/ru/wiki/Local_Sitemap',
];


for (var i = 0; i < sitemaps.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	sitemaps[i]+'#',
		linkpattern:	'/ru/wiki/',
		linkprefix:	'https://math.wikia.org',
		pause:500,
	});
}
