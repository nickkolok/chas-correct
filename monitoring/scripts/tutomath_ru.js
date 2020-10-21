var urllist = require('../../parser/urllist.js');

var name = 'tutomath_ru';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<main id="main")/i,
    /(<div id="comments")|(<\/main>)/i,
    {
        pause: 2000,
        name: name,
    }
);
