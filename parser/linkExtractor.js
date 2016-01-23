var fs = require('fs');
var parser = require('./parse-lib.js');

function LinkExtractor(o){
	this.pagesParsed = 0;
	this.pagesTotal  = 0;
	this.linksObject = o.linksObject || {};
	this.name        = o.name        || '';

	if(o.flushEvery){
		setInterval(this.writeExtractedURLs.bind(this),o.flushEvery);
	}

	if(!o.dontReadPrevious){
		var urlArray=JSON.parse(fs.readFileSync("urllists/"+this.name+".urllist.json",'utf-8'));
		console.log('Ссылок прочитано из файла: '+urlArray.length);
		for(var i=0; i<urlArray.length; i++){
			this.linksObject[urlArray[i]]=0;
		}
	}
}

LinkExtractor.prototype.defaultParameters={
	pagesCount:  5000,
	linkPattern: '',
	prefix:      '',
	postfix:     '',
};

LinkExtractor.prototype.extractURLlistFromURLsequence = function(o){
	o.__proto__=this.defaultParameters;
	this.pagesTotal+=o.pagesCount;

	for(var i=0; i<o.pagesCount; i++){
		parser.getHTMLfromURL(o.prefix+i+o.postfix,getUrls,i);
	}

	var linkRegExp=new RegExp('<a href="'+o.linkpattern+'[^"#]+',"g"); 
	var self=this;
	function getUrls(html,i){
		var urlsOnPage=(''+html).match(linkRegExp);
		if(urlsOnPage){
			for(var j=0; j<urlsOnPage.length; j++){
				self.linksObject[urlsOnPage[j].replace('<a href="',o.linkprefix)]=0;
			}
		}
		self.pagesParsed++;
		if(self.pagesParsed==self.pagesTotal){
			self.writeExtractedURLs(o);
		} else if(!(i%(o.reportEvery||20))){
			console.log(i);
		}
	}
}

LinkExtractor.prototype.writeExtractedURLs = function(){
	var keys=Object.keys(this.linksObject);
	fs.writeFile(
		"urllists/"+this.name+".urllist.json",
		JSON.stringify(keys).replace(/^\[/,'[\r\n').replace(/,"/g,',\r\n"').replace(/\]$/,'\r\n]')
	);
	console.log('В файл записано адресов: '+keys.length);
}

module.exports.LinkExtractor=LinkExtractor;
