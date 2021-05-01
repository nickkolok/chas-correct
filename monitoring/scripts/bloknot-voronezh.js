var urllist = require('../../parser/urllist.js');

var name = 'bloknot-voronezh';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<article>)/i,
	/(<b class="hideme">Новости на Блoкнoт-Воронеж<\/b>)|(<\/article>)/i,
	{
		pause: 2000,
		name: name,
	}
);
