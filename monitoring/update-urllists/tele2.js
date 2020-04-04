/*
var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name:	'tele2',
});

var sitemaps = ["https://voronezh.tele2.ru/sitemap/business_option/detail0.xml", "https://voronezh.tele2.ru/sitemap/business_tariff/detail0.xml", "https://voronezh.tele2.ru/sitemap/homeRoaming/detail0.xml", "https://voronezh.tele2.ru/sitemap/internationalRoaming/detail0.xml", "https://voronezh.tele2.ru/sitemap/news/detail0.xml", "https://voronezh.tele2.ru/sitemap/news/detail1.xml", "https://voronezh.tele2.ru/sitemap/option/detail0.xml", "https://voronezh.tele2.ru/sitemap/support_article/detail0.xml", "https://voronezh.tele2.ru/sitemap/support_category/detail0.xml", "https://voronezh.tele2.ru/sitemap/tariff/detail0.xml", "https://voronezh.tele2.ru/sitemap/static/detail0.xml"];


for (var i = 0; i < sitemaps.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	100,
		reportEvery: 10,
		flushEvery: 1000,
		prefix:	sitemaps[i]+'#',
		linkpattern:	'https://voronezh.tele2.ru/',
		linkprefix:	'',
		pause:5000,
	});
}
*/
var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'voronezh_tele2_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'https://voronezh.tele2.ru/',
});
