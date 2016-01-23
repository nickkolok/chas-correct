var urllist = require('../../parser/urllist.js');
//abireg.ru - тут сплошная нумерация
var abireglinks=[];
for(var i=2000; i<55000; i++){
	abireglinks.push('http://www.abireg.ru/n_'+i+'.html');
}
urllist.countErrorsInURLarray(abireglinks,100000,'<td class=news>','<div class=print>',{encoding:'win1251',name:'abireg',pause:500});
