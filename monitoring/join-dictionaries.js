var fs = require('fs');

var dictionary = {};
process.argv.slice(2).map(function(name){
	var currentDictionary = JSON.parse(fs.readFileSync(
		'results/' + name + '.words.json',
		'utf-8'
	));
	for(var word in currentDictionary) {
		if (word in dictionary){
			dictionary[word]+= currentDictionary[word];
		}else{
			dictionary[word] = currentDictionary[word];
		}
	}
});

var result = '';

for(var word in dictionary) {
	result += word + " " + dictionary[word] + '\n';
}


fs.writeFileSync(
	'results/'+process.argv.slice(2).join('+')+'.joined-dictionary.txt',
	result
);
