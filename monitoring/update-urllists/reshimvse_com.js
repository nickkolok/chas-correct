var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name:	'reshimvse_com',
});

var sitemaps = [
	'https://reshimvse.com/articles.php?cat=%D0%BC%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0',
	'https://reshimvse.com/articles.php?cat=%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F',
	'https://reshimvse.com/articles.php?cat=%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0',
	'https://reshimvse.com/articles.php?cat=%D1%84%D0%B8%D0%B7%D0%B8%D0%BA%D0%B0',
	'https://reshimvse.com/articles.php?cat=%D0%BC%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7',
	'https://reshimvse.com/articles.php?cat=%D1%82%D0%B5%D0%BE%D1%80%D0%B8%D1%8F_%D0%B2%D0%B5%D1%80%D0%BE%D1%8F%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9',
];


for (var i = 0; i < sitemaps.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	sitemaps[i]+'#',
		linkpattern:	'article.php',
		linkprefix:	'https://reshimvse.com/',
		pause:15000,
		delay:1000*i,
	});
}

var sitemaps2 = [
	'https://reshimvse.com/olympiad/?type=shagvbud',
	'https://reshimvse.com/olympiad/?type=fizteh',
	'https://reshimvse.com/olympiad/?type=dvimgu',
	'https://reshimvse.com/olympiad/?type=vseros',
];


for(var i = 0; i < 32; i++){
	sitemaps2.push('https://reshimvse.com/mathege/?type=mb'+i);
	sitemaps2.push('https://reshimvse.com/mathege/?type=mc'+i);
	sitemaps2.push('https://reshimvse.com/mathege/?type=m'+i+'baz&level=baz');
	sitemaps2.push('https://reshimvse.com/mathoge/?type='+i);
	sitemaps2.push('https://reshimvse.com/infege/?type=inf'+i);
	sitemaps2.push('https://reshimvse.com/physege/?type=f'+i);
	sitemaps2.push('https://reshimvse.com/physege/?type=fc'+i);
	sitemaps2.push('https://reshimvse.com/physoge/?type=f'+i);
}


for (var i = 0; i < sitemaps2.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	sitemaps2[i]+'#',
		linkpattern:	'/zadacha.php',
		linkprefix:	'https://reshimvse.com',
		pause:15000,
		delay:1000*i,
	});
}
