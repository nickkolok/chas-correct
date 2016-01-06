var urllist = require('../../parser/urllist.js');
//kp.ru - статьи колумнистов
//urllist.countErrorsInURLlist('vrn.kp_daily.urllist.json',1000000,'<body','</body>');
urllist.countErrorsInURLlist('urllists/kp-daily.urllist.json',1000000,'main-article_title','see-also-container');
