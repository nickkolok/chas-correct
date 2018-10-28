var urllist = require('../../parser/urllist.js');

// Универсальный типовой

var name = process.argv[2];

urllist.countErrorsInURLlist(
	'urllists/'+name+'.urllist.json',
	1000000,
	/<body/i,
	/<\/body/i,
	{
		pause:5000,
		name: name,
	}
);
