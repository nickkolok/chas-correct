var urllist = require('../../parser/urllist.js');

var name = 'moe-online_ru';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /<h1 class="st-name" itemprop="headline">/i,
    /<p id="end_news">/i,
    {
        pause: 2000,
        name: name,
    }
);
