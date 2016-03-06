var urllist = require('../../parser/urllist.js');
//matematikalegko.ru - классический WordPress, комментарии
urllist.countErrorsInURLlist(
	'urllists/matematikalegko.urllist.json',
	100000,
	'<div id="comments">',
	'<div id="sidebar">',
	{
		pause:1000,
		name: 'matematikalegko-comments'
	}
);
