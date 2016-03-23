var urllist = require('../../parser/urllist.js');
//ege-ok.ru - классический WordPress, комментарии
urllist.countErrorsInURLlist(
	'urllists/ege-ok.urllist.json',
	100000,
	'<div id="comments">',
	'<div id="sidebar">',
	{
		pause:2000,
		name:'ege-ok-comments',
	}
);
