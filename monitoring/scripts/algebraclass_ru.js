var urllist = require('../../parser/urllist.js');
var fs = require('fs');

var list=JSON.parse(fs.readFileSync("./urllists/algebraclass_ru.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	10000000,
	'<section id="content" role="main">',
	'<footer id="footer" role="contentinfo">',
	{
		name:'algebraclass_ru',
		pause:1500,
	}
);

