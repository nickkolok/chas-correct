//kommersant.ru, регион - Воронеж
var urllist = require('../../parser/urllist.js');

var name = 'kommersant-vrn';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<header>)/i,
	/(<div class="b-archive_link cf">)/i,
	{
		pause: 1000,
		name: name,
	}
);
