var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

function dumpSqliteWrapper(o){
	var self = this;
	this.o = o; // На всякий случай
	this.filename = o.filename;
	this._exists = fs.existsSync(this.filename);
	if(!this._exists) {
		console.log("Creating DB file.");
		fs.openSync(this.filename, "w");
	}
	this.db = new sqlite3.Database(this.filename);

	this.db.serialize(function() {
		if(!self._exists) {
			self.db.run("CREATE TABLE Dump (url TEXT, time NUMBER, content TEXT)");
		}
	});
	
	this.addURL = function(url,time,content){
		self.db.serialize(function() {	
			var stmt = self.db.prepare("INSERT INTO Dump VALUES (?, ?, ?)");
			stmt.run(url,time,content);
			stmt.finalize();
		});
	};

	this.extractURL = function(url, callbackIfFound, callbackIfNotFound) {
		self.db.serialize(function() {	
			self.db.all("SELECT rowid AS id, url, time, content FROM Dump WHERE url='"+url+"'", function(err, rows) {
				if(rows.length){
					callbackIfFound(rows);
				} else {
					callbackIfNotFound();
				}
			});
		});
	};
}

module.exports = dumpSqliteWrapper;

/* Пример использования:

var wrapper = new dumpSqliteWrapper({filename:'test2.sqlite'});

wrapper.addURL('://'+Math.random(),Date.now(),'abc'+Math.random());
wrapper.addURL('://',Date.now(),'abc');
wrapper.addURL('://'+Math.random(),Date.now(),'abc'+Math.random());

wrapper.extractURL('://',console.log, console.log);
wrapper.extractURL('://'+Math.random(),console.log, console.log);

*/
