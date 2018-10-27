var urllist = require('../../parser/urllist.js');
//matematikalegko.ru - классический WordPress
urllist.countErrorsInURLlist(
	'urllists/matematikalegko.urllist.json',
	200000,
	/(<h1 itemprop="headline">)|<body/i,
	/<ol class="commentlist">|<\/body/i,
	{
		pause:10000,
		name: 'matematikalegko',
	}
);
