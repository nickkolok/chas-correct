var urllist = require('../../parser/urllist.js');
//vrntimes.ru - удобнее с версии для печати, отдельный респект за <article>
urllist.countErrorsInURLlist('urllists/vrntimes.urllist.json',100000,'<article','</article>');
