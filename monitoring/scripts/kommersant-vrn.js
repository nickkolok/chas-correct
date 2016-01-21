var urllist = require('../../parser/urllist.js');
//kommersant.ru, регион - Воронеж
urllist.countErrorsInURLlist(
	'urllists/kommersant-vrn.urllist.json',
	100000,
	'<p class="b-article__text">',
	'<p class="b-article__text document_authors">',
	{encoding:'win1251',name:'kommersant-vrn'}
);
