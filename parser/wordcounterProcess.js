var Wordcounter=require('./wordcounter.js').Wordcounter;
var counter=new Wordcounter();

var yaspellerPong=require('./yaspeller-pong.js');

process.on('message', function (m) {
	switch(m.type){
		case 'newtext':
			counter.addBufferedText(m.text);
		break;
		case 'finish':
			counter.writeFiles(m.filename);
			yaspellerPong.getUnknownWordsList(m);
			process.send(counter.wordsCount);
			process.exit();
		break;
	}
});
