var urllist = require('../../parser/urllist.js');

var name = 'matematikaege_ru';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<div id="content">)|(<div class="single_post">)/i,
    /(<div id="comment_block">)|(<div id="footer">)/i,
    {
        pause: 2000,
        name: name,
    }
);
