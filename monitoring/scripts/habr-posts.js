var urllist = require('../../parser/urllist.js');
//habrahabr.ru - тут сплошная нумерация. Только статьи
var habrlinks=[];
for(var i=402001; i<426001; i+=2){
	habrlinks.push('http://habr.com/post/'+i+'/');
}

//habrlinks.sort(()=>Math.random()>0.5?1:-1);

urllist.countErrorsInURLarray(
	habrlinks,
	100000,
	'<span class="post__title-text">',
	'<form action="/json/favorites/"',
	{
		name:'habr-posts_402001-426000',
		pause:2000,
		nodumpuse:true,
		reportEvery : 10,
	}
);

