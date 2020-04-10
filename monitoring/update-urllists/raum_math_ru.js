var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'raum_math_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://raum.math.ru/',
	exclude: [
		'http://raum.math.ru/user/login',
		'http://raum.math.ru/user/register',
		'http://raum.math.ru/forum/',
		'https://raum.math.ru/user/login',
		'https://raum.math.ru/user/register',
		'https://raum.math.ru/forum/',
	],
});
