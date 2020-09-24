var urllist = require('../../parser/urllist.js');

var name = 'mathportal_net.js';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<div id="contentarea">)/i,
	/(<div id="footer-outer">)/i,
	{
		pause: 3000,
		name: name,
	}
);
