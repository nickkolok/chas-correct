var urllist = require('../../parser/urllist.js');

var name = 'treugolniki_ru';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<div id="content">)/i,
	/(<div id="comments">)/i,
	{
        pause: 5000,
        name: name,
	}
);
