var urllist = require('../../parser/urllist.js');
var fs = require('fs');
//Берём список урлов от версии для печати, преобразуем, скармливаем

var list=JSON.parse(fs.readFileSync("./urllists/cyberforum-maths.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	100000,
	'<div id="posts">',
	'<!-- start content table -->',
	{
		name:'cyberforum-maths',
		pause:400,
		nodumpuse: true,
		reportEvery:100,
	}
);

