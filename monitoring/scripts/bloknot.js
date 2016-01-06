var urllist = require('../../parser/urllist.js');
//bloknot.ru
urllist.countErrorsInURLlist('urllists/bloknot.urllist.json',100000,'<div id="social-top"','<div id="social-bottom"');
