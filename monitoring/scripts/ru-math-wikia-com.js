var urllist = require('../../parser/urllist.js');
var fs = require('fs');

var list=JSON.parse(fs.readFileSync("./urllists/ru-math-wikia-com.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	10000000,
	'<article id="WikiaMainContent" class="WikiaMainContent">',
//	'<!-- WikiaMainContent -->',
	'<nav class="WikiaArticleInterlang">',
	{
//		encoding:'win1251',
		name:'ru-math-wikia-com',
		pause:500,
	}
);

