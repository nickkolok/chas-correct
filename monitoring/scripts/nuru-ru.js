var urllist = require('../../parser/urllist.js');
var fs = require('fs');

var list=JSON.parse(fs.readFileSync("./urllists/nuru-ru.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	10000000,
	'<div class="CMSBreadCrumbs">',
	'<div id="Bottom">',
	{
//		encoding:'win1251',
		name:'nuru-ru',
		pause:1500,
	}
);

