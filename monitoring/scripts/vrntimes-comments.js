var urllist = require('../../parser/urllist.js');
var fs = require('fs');
//Берём список урлов от версии для печати, преобразуем, скармливаем

var list=JSON.parse(fs.readFileSync("./urllists/vrntimes.urllist.json", 'utf-8'));
for(var i=0; i<list.length; i++){
	list[i]=list[i].replace("http://vrntimes.ru/print/","http://vrntimes.ru/");
}
urllist.countErrorsInURLarray(list,100000,'id="edit-actions"','<div id="fbcommentss">',{name:'vrntimes-comments',pause:500,});

