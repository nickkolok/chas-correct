var urllist = require('../../parser/urllist.js');

var name = 'matemonline_com';

urllist.countErrorsInURLlist(
	'urllists/' + name + '.urllist.json',
	1000000,
	/(<div class="single_page">)|(<div id="post-)|(<html xmlns)/i,
	/(<div id="comments">)|(<div id="commentsAdd">)|(<div id="footer">)|(<\/body>)/i,
	{
        pause: 2000,
        name: name,
	}
);
