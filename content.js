var oldTime = new Date().getTime();

var wordSplitSymbol="([^А-Яа-яЁёA-Za-z])";

function replaceWord(ih, word, str, prefix, postfix){
	var firstLetter=word[0];
	var lostWord=word.substr(1);
	var pattern =
		(prefix ? wordSplitSymbol : "(.)" ) +
		"(["+firstLetter.toLowerCase()+firstLetter.toUpperCase()+"])"+lostWord+
		(postfix ? wordSplitSymbol : "(.)" );
	return ih.replace(new RegExp(pattern,"g"),"$1$2"+str.substr(1)+"$3");
}

var orphoWordsToCorrect=[
	["еще","ещё"],
	["пороль","пароль"],
	["дрож","дрожь"],
	["извени","извини"],
	["жжот","жжёт"],
	["нехочу","не хочу"],
	["молодёж","молодёжь"],
	["полувер","пуловер"],
	["в расплох","врасплох"],
	["продовца","продавца"],
	["всмысле","в смысле"],
	["штоле","что ли"],
	["н[еи]знаю","не знаю"],
	["это-ж","это ж"],
	["падажди","подожди"],
/*	["",""],
	["",""],
/*
	["",""],
*/
];

var orphoPrefixToCorrect=[
	["соеденин","соединен"],
	["з(?=[бжкпстф-щБЖКПСТФ-Щ])","с"],
/*
	["",""],
*/
];

var orphoPostfixToCorrect=[
	["борятся","борются"],
	["сыпится","сыпется"],
	["г[ао]в[ао]риш","говоришь"],
/*
	["",""],
*/
];

var orphoFragmentsToCorrect=[
	["будующ","будущ"],
	["празн","праздн"],
	["призидент","президент"],
	["призедент","президент"],
/*
	["",""],
*/
];

var matyuki=[
];

var yo=[
];

function mainWork(ih){
	ih=ih.replace(/([\s?!.,:;])([Вв])о\sпервых(?=[\s?!.,:;])/g,"$1$2о-первых");
	ih=ih.replace(/([.?!А-Яа-яЁё])\1{3,}/g,"$1$1$1");
	ih=ih.replace(/[ь]{2,}/g,"ь");
	ih=ih.replace(/[ъ]{2,}/g,"ъ");

	ih=ih.replace(/[(]{6,}/g,"(((");
	ih=ih.replace(/[)]{6,}/g,")))");

	ih=ih.replace(/([ЖжШшЩщ])[ыЫ]/g,"$1и");
	ih=ih.replace(/([ЧчЩщ])[яЯ]/g,"$1а");
	ih=ih.replace(/([ЧчЩщ])[юЮ]/g,"$1у");
	ih=ih.replace(/ньч/gi,"нч");
	ih=ih.replace(/ньщ/gi,"нщ");
	ih=ih.replace(/чьн/gi,"чн");
	ih=ih.replace(/чьк/gi,"чк");
	
	for(var i=0; i<orphoWordsToCorrect.length; i++)
		ih=replaceWord(ih,orphoWordsToCorrect[i][0],orphoWordsToCorrect[i][1],1,1);
	for(var i=0; i<orphoPostfixToCorrect.length; i++)
		ih=replaceWord(ih,orphoPostfixToCorrect[i][0],orphoPostfixToCorrect[i][1],0,1);
	for(var i=0; i<orphoPrefixToCorrect.length; i++)
		ih=replaceWord(ih,orphoPrefixToCorrect[i][0],orphoPrefixToCorrect[i][1],1,0);
	for(var i=0; i<orphoFragmentsToCorrect.length; i++)
		ih=replaceWord(ih,orphoFragmentsToCorrect[i][0],orphoFragmentsToCorrect[i][1],0,0);
//	console.log(ih);

//	ih=ih.replace(/[\s.,>]бля[\s.,<]/g," ");

//	ih=ih.replace(/([\s.,])еще([\s.,])/g,"$1ещё$2");
	
	return ih;
}

function changeStrings(n, callback) {
	// Эта рекурсивная функция отыскивает все текстовые узлы

	if (n.nodeType == 3 /* Node.TEXT_NODE */){
		n.data=callback(n.data);
	} else if (n.nodeType == 1 /* Node.ELEMENT_NODE */ || n.nodeType == 1 /* document */) {
		// Обратите внимание, обход выполняется с использованием firstChild/nextSibling
		for (var m = n.firstChild; m != null; m = m.nextSibling) {
			changeStrings(m, callback);
		}
	}
}

changeStrings(document.body,mainWork);
console.log("chas-correct отработал. Времени затрачено (мс): "+(new Date().getTime() - oldTime));
