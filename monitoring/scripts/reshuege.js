var urllist = require('../../parser/urllist.js');
var links=[];
for(var i=0; i<300; i++){
	links.push('https://ege.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://mathb-ege.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://inf-ege.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://phys-ege.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://math-oge.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://inf-oge.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://phys-oge.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://math-ct.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://phys-ct.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://phys11-vpr.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://math4-vpr.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://math5-vpr.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
	links.push('https://math6-vpr.sdamgia.ru/test?theme='+i+'&ttest=true&wclones=1');
}
urllist.countErrorsInURLarray(links,2000000,'<body','</body>',{
	name:'reshuege',
	pause:5000,
});
