var urllist = require('../../parser/urllist.js');
//ege-ok.ru - классический WordPress
urllist.countErrorsInURLlist(
	'urllists/ege-ok.urllist.json',
	100000,
	'<span class="avtor" itemprop="headline">Репетитор по математике</span>',
	'<div class="postinfo">',
	{
		pause:2000,
	}
);
