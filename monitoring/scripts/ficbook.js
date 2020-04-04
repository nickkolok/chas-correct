var urllist = require('../../parser/urllist.js');
var abireglinks=[];
for(var i=5854302; i<5854612; i++){
	abireglinks.push('https://ficbook.net/readfic/'+i);
}
urllist.countErrorsInURLarray(abireglinks,100000,'<body','</body>',{
	name:'ficbook',
	pause:100,
});
//TODO: refactor!
