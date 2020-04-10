var urllist = require('../../parser/urllist.js');
var fs = require('fs');

var list=JSON.parse(fs.readFileSync("./urllists/ru_solverbook_com.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	10000000,
	/(<div class="breadcrumbs roundRectangle shadow">)|(<div class="articles-single-content main")/,
	/(<!-- .mainWrapper -->)|(<!-- .megaWrapper -->)|(<div class="footer">)/,
	{
		name:'ru_solverbook_com',
		pause:1500,
	}
);

