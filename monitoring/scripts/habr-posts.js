var urllist = require('../../parser/urllist.js');
//habrahabr.ru - тут сплошная нумерация. Только статьи
var habrlinks=[];
for(var i=170000; i<173000; i++){
	habrlinks.push('http://habrahabr.ru/post/'+i+'/');
}
urllist.countErrorsInURLarray(habrlinks,10000000000,'<div class="content html_format">','<ul class="tags icon_tag">',{name:'habr-posts'});

