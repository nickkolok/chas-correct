var urllist = require('../../parser/urllist.js');
//bash.im, страницы

var bashlinks=[];
for(var i=1; i<1123; i++){
	bashlinks.push('http://bash.im/index/'+i+'');
}
urllist.countErrorsInURLarray(
	bashlinks,
	100000,
	'<div id="header">',
	'<div class="inside"><div class="submenu">',
	{
		encoding:'win1251',
		name:'bash',
	}
);


