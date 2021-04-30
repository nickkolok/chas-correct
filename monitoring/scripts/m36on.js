var urllist = require('../../parser/urllist.js');

//36on.ru - удобнее с мобильной версии
var name = 'm36on';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<div class='mobile_title l-page__content text'>)/i,
	/(<div class='share_block'>)/i,
	{
		pause: 500,
		name: name,
	}
);
