var urllist = require('../../parser/urllist.js');
var fs = require('fs');

var list=JSON.parse(fs.readFileSync("./urllists/lifehacker.urllist.json", 'utf-8'));

var start = 4000, end = 40000;

list = list.slice(start, end);

urllist.countErrorsInURLarray(
	list,
	2000000,
	'<div class="desktop-fixed-bar__subtitle">',
	'<div class="single-post-footer">',
	{
		name:'lifehacker_'+start+'-'+end,
		pause:1000,
		nodumpuse: true,
		reportEvery: 10,
	}
);

