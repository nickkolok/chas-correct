// main.js

var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: "*",
	contentScriptFile: [
		data.url("jquery-2.1.0.min.js"	),
		data.url("jstorage.min.js"		),
		data.url("dictionary.js"		),
		data.url("prepareDictionary.js"		),
		data.url("content.js"			),
	],
});

