var urllist = require('../../parser/urllist.js');
var fs = require('fs');
//Берём список урлов от версии для печати, преобразуем, скармливаем

var list=JSON.parse(fs.readFileSync("./urllists/forum_exponenta_ru.urllist.json", 'utf-8'));

urllist.countErrorsInURLarray(
	list,
	100000,
	'<h2 class="topic-title">',
	'<div id="page-footer" role="contentinfo">',
	{
		name:'forum_exponenta_ru',
		pause:1500,
	}
);

