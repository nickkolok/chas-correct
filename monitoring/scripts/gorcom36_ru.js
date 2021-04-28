var urllist = require('../../parser/urllist.js');

var name = 'gorcom36_ru';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<div class="detail_container white">)|(<div class="time_date">)/i,
    /(<div class="footer">)|(<\/body>)/i,
    {
        pause: 2000,
        name: name,
    }
);
