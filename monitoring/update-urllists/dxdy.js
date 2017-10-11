var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'dxdy',
});

var prefixes = [
	'http://dxdy.ru/matematika-obschie-voprosy-f1-',
	'http://dxdy.ru/analiz-i-f65-',
	'http://dxdy.ru/pomogite-reshit-razobratsya-m-f27-',
	'http://dxdy.ru/analiz-ii-f66-',
	'http://dxdy.ru/veroyatnost-statistika-f67-',
	'http://dxdy.ru/vysshaya-algebra-f68-',
	'http://dxdy.ru/diskretnaya-matematika-kombinatorika-teoriya-chisel-f69-',
	'http://dxdy.ru/mat-logika-osnovaniya-matematiki-teoriya-algoritmov-f70-',
	'http://dxdy.ru/chislennye-i-vychislitelnye-metody-optimizatsiya-f71-',
	'http://dxdy.ru/geometriya-f73-',
	'http://dxdy.ru/shkolnaya-algebra-f72-',
	'http://dxdy.ru/prochee-f74-',
	'http://dxdy.ru/olimpiadnye-zadachi-m-f26-',
	'http://dxdy.ru/velikaya-teorema-ferma-f62-',
	'http://dxdy.ru/diskussionnye-temy-m-f28-',
	'http://dxdy.ru/internet-resursy-m-f36-',
	'http://dxdy.ru/matematicheskij-spravochnik-f52-',
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
		pause:5000,
	});
}

