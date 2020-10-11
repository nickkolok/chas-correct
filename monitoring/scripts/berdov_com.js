var urllist = require('../../parser/urllist.js');

var name = 'berdov_com';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<div class="article">)/i,
    /(<footer>)|(<\/body>)/i,
    {
        pause: 2000,
        name: name,
    }
);
