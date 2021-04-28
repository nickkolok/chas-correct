var urllist = require('../../parser/urllist.js');

var name = 'riavrn_ru';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<div class="article-intro">)/i,
    /(<div class="article-info tag-tabs-info">)/i,
    {
        pause: 2000,
        name: name,
    }
);
