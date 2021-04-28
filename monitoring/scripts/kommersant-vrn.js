//kommersant.ru, регион - Воронеж
var urllist = require('../../parser/urllist.js');

var name = 'kommersant-vrn';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<header>)/i,
	/(<p class="b-article__text document_authors">)/i,
	{
		pause: 1000,
		name: name,
	}
);
