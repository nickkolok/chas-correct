var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 2000,
	name: 'bloknot-voronezh',
});


extractor.extractURLlistFromURLsequence({
	pagesCount: 1000,
	reportEvery: 2000,
	flushEvery: 2000,
	prefix: 'https://bloknot-voronezh.ru/?PAGEN_1=',
	linkpattern: '/news/',
	linkprefix: 'https://bloknot-voronezh.ru',
	pause: 2000,
	exclude: [
		'/?PAGEN_1=',
		'/poster/',
		'/museum/',
		'/culture/',
		'/the_city_faces/',
		'/national_correspondent/',
		'/society/',
		'/policy/',
		'/incident/',
		'/sport/',
		'/i_want_to_say/',
		'/business/',
		'/auto/',
		'/the_face_of_our_city/',
		'/sports/',
		'/photos/',
		'/economy/',
		'/novosti-za-segodnya/',
		'/novosti-za-vchera/',
		'/novosti-za-nedelyu/',
		'/novosti-za-mesyac/'
	]
});
