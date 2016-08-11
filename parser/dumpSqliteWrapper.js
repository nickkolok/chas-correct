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

	this.URLsQueued=980;
	this.queue=[];
	this.queueURL = function(url,time,content){
		this.queue.push([url,time,content]);
		this.URLsQueued++;
		if(!(this.URLsQueued%10)){
			this.flushQueue();
		}
	};

	this.flushQueue = function(){
		if(!self.queue.length){
			return;
		}
		var command="INSERT INTO 'Dump' ('url', 'time', 'content') VALUES \n";
		for(var i=0; i<self.queue.length; i++){
			command+=
				"('"+
					self.queue[i][0].replace(/'/g,"''")+
				"', '"+
					self.queue[i][1]+
				"', '"+
					self.queue[i][2].replace(/'/g,"''")+
				"'), ";
		}
		command=command.replace(/[,]\s*$/,"; ");
		self.db.run(command);
		console.log('Записи добавлены в дамп');
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
