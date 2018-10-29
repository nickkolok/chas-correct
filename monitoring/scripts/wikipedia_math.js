var urllist = require('../../parser/urllist.js');

urllist.countErrorsInURLlist(
	'urllists/wikipedia_math.urllist.json',
	10000000,
	'<div id="siteSub" class="noprint">Материал из Википедии — свободной энциклопедии</div>',
	/(NewPP limit report)|(<div class="printfooter">)/i,
	{
		pause:50,
		name: 'wikipedia_math',
		//nodumpuse:true,
	}
);
