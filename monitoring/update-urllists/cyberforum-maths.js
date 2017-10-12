var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'cyberforum-maths',
});

var prefixes = [
	'http://www.cyberforum.ru/mathematics',
	'http://www.cyberforum.ru/differential-equations',
	'http://www.cyberforum.ru/discrete-mathematics',
	'http://www.cyberforum.ru/automata-theory',
	'http://www.cyberforum.ru/mathematical-analysis',
	'http://www.cyberforum.ru/geometry',
	'http://www.cyberforum.ru/statistics',
	'http://www.cyberforum.ru/algebra',
	'http://www.cyberforum.ru/numerical-methods',
	'http://www.cyberforum.ru/tfkp-operational-calculus',
	'http://www.cyberforum.ru/mathematical-logic-sets',
	'http://www.cyberforum.ru/optimization-methods',
	'http://www.cyberforum.ru/combinatorics',
	'http://www.cyberforum.ru/functional-analysis',
];


for (var i = 0; i < prefixes.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	500,
		reportEvery: 2,
		flushEvery: 150,
		prefix:	prefixes[i]+'-page',
		postfix: '.html',
		linkpattern:	'',
		linkprefix:	'http://www.cyberforum.ru/',
		pause:5000,
	});
}

