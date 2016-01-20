var Wordcounter=require('./wordcounter.js').Wordcounter;
var counter=new Wordcounter();

process.on('message', function (m) {
	switch(m.type){
		case 'newtext':
			counter.addBufferedText(m.text);
		break;
		case 'finish':
			counter.writeFiles(m.filename);
			process.send(counter.wordsCount);
			process.exit();
		break;
	}
});
