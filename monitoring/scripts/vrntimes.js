var urllist = require('../../parser/urllist.js');
//vrntimes.ru - удобнее с версии для печати, отдельный респект за <article>
var name = 'vrntimes';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<article)/i,
	/(<\/article>)/i,
	{
		pause: 2000,
		name: name,
	}
);
