var urllist = require('../../parser/urllist.js');
var fs = require('fs');

var list=JSON.parse(fs.readFileSync("./urllists/ru_onlinemschool_com.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	10000000,
	/<body/i,
	/<\/body/i,
	{
		name:'ru_onlinemschool_com',
		pause:1500,
	}
);

