var urllist = require('../../parser/urllist.js');
//И комментарии
var habrcommentlinks=[];
for(var i=170000; i<173000; i++){
	habrcommentlinks.push('http://m.habrahabr.ru/post/'+i+'/comments/');
}
urllist.countErrorsInURLarray(habrcommentlinks,100000,'<div class="comments_list">','<div class="popular_posts">',{name:'habr-comments'});

