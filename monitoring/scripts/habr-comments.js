var urllist = require('../../parser/urllist.js');
//И комментарии
var habrcommentlinks=[];
for(var i=1; i<440000; i++){
	habrcommentlinks.push('http://m.habrahabr.ru/post/'+i+'/comments/');
}
urllist.countErrorsInURLarray(
	habrcommentlinks,
	1000000,
	'<ul class="content-list content-list_comments" id="comments-list">',
	'<div class="sidebar_right sidebar_comments js-sidebar_right">',
	{name:'habr-comments'}
);

