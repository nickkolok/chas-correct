var urllist = require('../../parser/urllist.js');

var name = 'for6cl_uznateshe_ru';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<div id="content">)/i,
	/<(<div id="comments">)|(<\/body>)/i,
	{
        pause: 2000,
        name: name,
	}
);
