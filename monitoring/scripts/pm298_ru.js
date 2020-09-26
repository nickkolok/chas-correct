var urllist = require('../../parser/urllist.js');

var name = 'pm298_ru';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<body)/i,
	/(<\/body>)/i,
	{
        pause: 3000,
        name: name,
	}
);
