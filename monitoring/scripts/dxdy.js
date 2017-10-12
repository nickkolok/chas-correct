var urllist = require('../../parser/urllist.js');
var fs = require('fs');
//Берём список урлов от версии для печати, преобразуем, скармливаем

var list=JSON.parse(fs.readFileSync("./urllists/dxdy.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	100000,
	'<div id="pagecontent">',
	'<div id="recs">',
	{
		name:'dxdy',
		pause:400,
	}
);

