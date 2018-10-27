var urllist = require('../../parser/urllist.js');
//abireg.ru - тут сплошная нумерация
var links=[];
for(var i=0; i<=96; i++){
	links.push(
//		'https://api.vk.com/method/wall.get?owner_id=-131498541&offset='+i+'00&count=100&v=5.52&access_token=43c632c043c632c043c632c0f743ead2b4443c643c632c018715ebc0b11b2c54465c931'
//		'https://api.vk.com/method/wall.get?owner_id=-106084026&offset='+i+'00&count=100&v=5.52&access_token=43c632c043c632c043c632c0f743ead2b4443c643c632c018715ebc0b11b2c54465c931'
		'https://api.vk.com/method/wall.get?owner_id=-71729358&offset='+i+'00&count=100&v=5.52&access_token=43c632c043c632c043c632c0f743ead2b4443c643c632c018715ebc0b11b2c54465c931'
	);
}

urllist.countErrorsInURLarray(links,100000,'"response"',/$/,{
//	encoding:'win1251',
	name:'vkpublic-test-styd-pozor',
	pause:3000,
});
