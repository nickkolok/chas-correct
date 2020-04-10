var urllist = require('../../parser/urllist.js');

// Универсальный типовой

var name = 'egetrener_ru';

urllist.countErrorsInURLlist(
	'urllists/'+name+'.urllist.json',
	1000000,
	/<body/i,
	/<p class='post_comment'>|<p class='post_title2'>Комментарии к урокам<\/p>|<\/body/i,
	{
		pause:5000,
		name: name,
	}
);
