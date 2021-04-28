var urllist = require('../../parser/urllist.js');

var name = 'vrntimes_ru';

urllist.countErrorsInURLlist(
    'urllists/' + name + '.urllist.json',
    1000000,
    /(<div id="contentinner">)/i,
    /(<div class="createddate">)/i,
    {
        pause: 2000,
        name: name,
    }
);
