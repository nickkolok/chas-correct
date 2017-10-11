var urllist = require('../../parser/urllist.js');
//matematikalegko.ru - классический WordPress
urllist.countErrorsInURLlist(
	'urllists/matematikalegko.urllist.json',
	100000,
	'<div class="postmeta">',
	'<div class="postinfo">', {
		pause:1000,
		name: 'matematikalegko',
	}
);
