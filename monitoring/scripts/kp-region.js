var urllist = require('../../parser/urllist.js');
//kp.ru - короткие региональные заметки. Осторожно, отдаёт браузеру и скрипту разный HTML!
urllist.countErrorsInURLlist('urllists/kp-region.urllist.json',500000000,'<body','</body>');
