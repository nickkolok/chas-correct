var urllist = require('../../parser/urllist.js');

//36on.ru - удобнее с мобильной версии
urllist.countErrorsInURLlist(
	'urllists/m36on.urllist.json',
	10000000,
	"<div class='mobile_title l-page__content text'>",
	"<div class='share_block'>",
	{pause:500}
);
