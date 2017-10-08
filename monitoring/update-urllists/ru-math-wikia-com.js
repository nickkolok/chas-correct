var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10,
	name:	'ru-math-wikia-com',
});

var sitemaps = [
	'http://ru.math.wikia.com/wiki/Local_Sitemap?namefrom=-1_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29&nameto=%D0%90%D1%84%D1%84%D0%B8%D0%BD%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%80%D0%B0%D0%BD%D1%81%D1%82%D0%B2%D0%BE&ns=0',
	'http://ru.math.wikia.com/wiki/Local_Sitemap?namefrom=%D0%91%D0%B0%D0%B7%D0%B0_%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8&nameto=%D0%9A%D0%BE%D1%81%D0%B5%D0%BA%D0%B0%D0%BD%D1%81&ns=0',
	'http://ru.math.wikia.com/wiki/Local_Sitemap?namefrom=%D0%9A%D0%BE%D1%81%D0%B8%D0%BD%D1%83%D1%81&nameto=%D0%9F%D0%BE%D0%BB%D0%B8%D0%BD%D0%B8%D0%BB%D1%8C%D0%BF%D0%BE%D1%82%D0%B5%D0%BD%D1%82%D0%BD%D0%B0%D1%8F_%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%B0&ns=0',
	'http://ru.math.wikia.com/wiki/Local_Sitemap?namefrom=%D0%9F%D0%BE%D0%BB%D0%B8%D1%86%D0%B8%D0%BA%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%B0&nameto=%D0%A2%D0%B5%D0%BE%D1%80%D0%B5%D0%BC%D0%B0_%D0%9A%D0%BD%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%B0_%E2%80%94_%D0%A2%D0%B0%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE&ns=0',
	'http://ru.math.wikia.com/wiki/Local_Sitemap?namefrom=%D0%A2%D0%B5%D0%BE%D1%80%D0%B5%D0%BC%D0%B0_%D0%9A%D0%BE%D0%BB%D0%BC%D0%BE%D0%B3%D0%BE%D1%80%D0%BE%D0%B2%D0%B0&nameto=%E2%88%921_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29&ns=0',
	'http://ru.math.wikia.com/wiki/Local_Sitemap?namefrom=-1_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29&nameto=%E2%88%921_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29&ns=1',
	'http://ru.math.wikia.com/wiki/Local_Sitemap?namefrom=-1_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29&nameto=%E2%88%921_%28%D1%87%D0%B8%D1%81%D0%BB%D0%BE%29&ns=4',
];


for (var i = 0; i < sitemaps.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	sitemaps[i]+'#',
		linkpattern:	'/wiki/',
		linkprefix:	'http://ru.math.wikia.com',
		pause:500,
	});
}
