var urllist = require('../../parser/urllist.js');
//moe-online.ru
urllist.countErrorsInURLlist('urllists/moe-online.urllist.json',1000000,'<li id="toc">','<div id="orphus1" title="Система Orphus">',{pause:500});
