var urllist = require('../../parser/urllist.js');
//habrahabr.ru - тут сплошная нумерация. Только статьи
var habrlinks=[];
for(var i=100000; i<500000; i++){
	habrlinks.push('http://habrahabr.ru/post/'+i+'/');
}
urllist.countErrorsInURLarray(
	habrlinks,
	10000000000,
	'<span class="post__title-text">',
	'<form action="/json/favorites/"',
	{
		name:'habr-posts',
		pause:3000,
	}
);

