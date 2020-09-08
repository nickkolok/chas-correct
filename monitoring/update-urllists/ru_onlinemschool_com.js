var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'ru_onlinemschool_com',
});


extractor.extractURLlistFromSiteRecursive({
	pause:1000,
	root: 'http://ru.onlinemschool.com/',
	exclude:[
		/^https:\/\/accounts\.google\.com/,
		/^https:\/\/twitter\.com/,
		/^https?:\/\/ru\.onlinemschool\.com\/modules\/feedback\//,
		/https:\/\/ru.onlinemschool.com\/math\/practice\/arithmetic\/multiplication_[^2]\d?_times_table/,
		/https:\/\/ru.onlinemschool.com\/math\/practice\/arithmetic\/[^2]\d?_times_table_division/
	],
});
