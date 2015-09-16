// main.js

var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: "*",
	contentScriptFile: [
		data.url("dictionary.js"		),
		data.url("prepareDictionary.js"	),
		data.url("content.js"			),
	],
});

