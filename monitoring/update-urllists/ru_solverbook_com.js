var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'ru_solverbook_com',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://ru.solverbook.com/',
	exclude: [
		'http://ru.solverbook.com/question/',
		'http://ru.solverbook.com/spravochnik/menedzhment/',
		'http://ru.solverbook.com/spravochnik/ekonomika/',
		'http://ru.solverbook.com/spravochnik/formuly-po-ekonomike/',
		'http://ru.solverbook.com/spravochnik/ximiya/',
		'http://ru.solverbook.com/spravochnik/svojstva-po-ximii/',
		'http://ru.solverbook.com/spravochnik/formuly-po-ximii/',
	],
});
