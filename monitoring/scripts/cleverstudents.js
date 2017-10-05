var urllist = require('../../parser/urllist.js');
var fs = require('fs');
//Берём список урлов от версии для печати, преобразуем, скармливаем

var list=JSON.parse(fs.readFileSync("./urllists/cleverstudents.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	10000000,
	'<body',
	'</body>',
	{
		encoding:'win1251',
		name:'cleverstudents',
		pause:1500,
	}
);

