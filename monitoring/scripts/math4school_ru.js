var urllist = require('../../parser/urllist.js');

var name = 'math4school_ru';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<div class="art-post-body">)/i,
	/(<div class="art-footer">)/i,
	{
		pause: 3000,
		name: name,
	}
);

