var urllist = require('../../parser/urllist.js');

// Универсальный типовой

var name = 'egemaximum_ru';

urllist.countErrorsInURLlist(
	'urllists/'+name+'.urllist.json',
	1000000,
	/<body/i,
	/<div id="comments">|<div id="related">|<\/body/i,
	{
		pause:5000,
		name: name,
	}
);
