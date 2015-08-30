// main.js

var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var ui = require("sdk/ui");

var actionButton = ui.ActionButton({
  id: "chas-correct",
  label: "chas-correct",
  icon: data.url("icon.png"),

  onClick: function(state) {
    tabs.activeTab.attach({
      contentScriptFile: [
        data.url("jquery-2.1.0.min.js"),
        data.url("jstorage.min.js"),
        data.url("dictionary.js"),
        data.url("prepareDictionary.js"),
        data.url("content.js"),
      ],
    });
  }
});
