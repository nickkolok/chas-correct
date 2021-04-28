var urllist = require('../../parser/urllist.js');

var name = 'vestivrn-novosti';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<h1 class="news-title">)/i,
	/(<\/section>)/i,
	{
		pause: 2000,
		name: name,
	}
);
