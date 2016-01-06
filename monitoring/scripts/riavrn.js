var urllist = require('../../parser/urllist.js');
//riavrn.ru - удобнее с мобильной версии
urllist.countErrorsInURLlist('urllists/riavrn.urllist.json',200000000,'<div class="page-inner">','<div class="article-comments-social">');
