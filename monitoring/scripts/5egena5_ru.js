var urllist = require('../../parser/urllist.js');

var name = '5egena5_ru';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<div id="header">)/i,
    /(<div id="footer">)/i,
    {
        pause: 2000,
        name: name,
    }
);
