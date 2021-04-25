var fs = require('fs');

var Crawler = require("js-crawler");

var parser = require('./parse-lib.js');

function LinkExtractor(o){
	this.pagesParsed = 0;
	this.pagesTotal  = 0;
	this.linksObject = o.linksObject || {};
	this.name        = o.name        || '';
	this.stripSid    = o.stripSid;

	if(o.flushEvery){
		this.flushInterval = setInterval(this.writeExtractedURLs.bind(this),o.flushEvery);
	}

	if(!o.dontReadPrevious){
		try{
			var urlArray=JSON.parse(fs.readFileSync("urllists/"+this.name+".urllist.json",'utf-8'));
			console.log('Ссылок прочитано из файла: '+urlArray.length);
			//urlArray.sort(()=>(Math.random()>0.61?1:-1));
			urlArray.map((uri)=>encodeURI(uri));
			for(var i=0; i<urlArray.length; i++){
				this.linksObject[urlArray[i]]=0;
			}
		} catch (e) {
			console.log('Не удалось открыть список URL-адресов '+"urllists/"+this.name+".urllist.json");
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
		(function(o,i){
			setTimeout(function(){
				parser.getHTMLfromURL(o.prefix+i+o.postfix,getUrls);
			},(o.pause||100)*i + (o.delay||0));
		})(o,i);
	}

	var linkRegExp=new RegExp('<a[^>]+href="'+o.linkpattern+'[^"#]+',"g");
	var self=this;
	function getUrls(html,i){
//		console.log(''+html);
		var urlsOnPage=(''+html).match(linkRegExp);
		if(urlsOnPage){
			for(var j=0; j<urlsOnPage.length; j++){
				self.linksObject[encodeURI(urlsOnPage[j].replace(/<a[^>]+href="/g,o.linkprefix))]=0;
			}
			self.filterExtratedURLs('', o);
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
	this.writeExtractedURLsArray(Object.keys(this.linksObject));
}

LinkExtractor.prototype.writeExtractedURLsArray = function(array){
	if (this.stripSid) {
		array = array.map(function(u){return u.replace(/\?sid=[0-9a-f]+$/,'')});
	}
	fs.writeFile(
		"urllists/"+this.name+".urllist.json",
		JSON.stringify(array).replace(/^\[/,'[\r\n').replace(/,"/g,',\r\n"').replace(/\]$/,'\r\n]'),
		function(){
			console.log('В файл записано адресов: '+array.length);
		}
	);
}

function isNonParseableFormat(url){
	return (
		/\.(zip|rar|exe|jpe?g|png|mp3|mp4|gif|svg|swf|djvu|pdf|od.|rtf|docx?|xlsx?|pptx?|ppsx?|dotx?|xltx?)$/i.test(url)
	);
}

LinkExtractor.prototype.filterExtratedURLs = function(signature, o){
	for (l in this.linksObject){
		if(l.search(signature) === -1 || isNonParseableFormat(l)){
			delete this.linksObject[l];
		}
		if(o && o.exclude){
			for(var i = 0; i < o.exclude.length; i++){
				if(l.search(o.exclude[i])!==-1){
					delete this.linksObject[l];
					break;
				}
			}		
		}
	}
}

LinkExtractor.prototype.extractURLlistFromSiteRecursive = function(o){

	var self = this;

	var signature = o.root.replace(/^https?\:\/\//,'');

	self.filterExtratedURLs(signature, o);
	var crawler = new Crawler().configure({
		shouldCrawl: function(url) {
			//console.log('Thinking about ' + url);
			//console.log(url.indexOf(signature));
			if(o.exclude){
				for(var i = 0; i < o.exclude.length; i++){
					if(url.search(o.exclude[i])!==-1){
						return false;
					}
				}
			}
			return (
				!isNonParseableFormat(url) &&
				url.indexOf(signature) >= 0
			);
		},
		depth: o.depth || 1000,
		maxRequestsPerSecond: (1000/o.pause) || 1,
		maxConcurrentRequests: 5,
		userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/69.0.3497.81 Chrome/69.0.3497.81 Safari/537.36",
	});


	crawler.crawl(o.root, function(page) {
		self.linksObject[page.url]=1;
		self.filterExtratedURLs(signature, o);
	}, null, function onAllFinished(crawledUrls) {
		self.filterExtratedURLs(signature, o);
		self.writeExtractedURLs();
		clearInterval(this.flushInterval);
		console.log('Краулинг закончен!');
	});

}


module.exports.LinkExtractor=LinkExtractor;
