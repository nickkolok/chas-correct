var urllist = require('../../parser/urllist.js');

var name = 'bloknot-voronezh';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<div class="news-item-info">)/i,
	/(<b class="hideme">Новости на Блoкнoт-Воронеж<\/b>)/i,
	{
		pause: 2000,
		name: name,
	}
);
