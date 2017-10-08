var urllist = require('../../parser/urllist.js');
var fs = require('fs');

var list=JSON.parse(fs.readFileSync("./urllists/1cov-edu_ru.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	10000000,
	'<div id="contents_inner" itemscope=""',
	'<div id="content_bottom"',
	{
//		encoding:'win1251',
		name:'1cov-edu_ru',
		pause:2000,
	}
);

