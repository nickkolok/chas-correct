var urllist = require('../../parser/urllist.js');
//abireg.ru - тут сплошная нумерация
var abireglinks=[];
for(var i=2000; i<55000; i++){
	abireglinks.push('http://www.abireg.ru/n_'+i+'_comment.html');
}
urllist.countErrorsInURLarray(abireglinks,100000,
	'<h2><a name="comm">Комментарии на Abireg.ru</a></h2>',
	'<div id=mat>Абирег реализует для своих читателей политику только интересных, адекватных и здравомыслящих комментариев. Спасибо за понимание</div>',
	{
		encoding:'win1251',
		name:'abireg-comments',
		pause:500
	}
);
