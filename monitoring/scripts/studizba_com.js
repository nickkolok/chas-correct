var urllist = require('../../parser/urllist.js');

var name = 'studizba_com';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<div class="post-block">)/i,
    /(<footer class="footer">)/i,
    {
        pause: 3000,
        name: name,
        rejectUnauthorized: false, //отключаем необходимость в сертификатах
    }
);
