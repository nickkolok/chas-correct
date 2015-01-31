var oldTime = new Date().getTime();

var wordSplitSymbol="([^А-Яа-яЁёA-Za-z]|^|$)";
var actionArray=[];
var minimalLiteralLength=20480; //Пока с потолка


function prepareExpression(word, str, prefix, postfix){
	var firstLetter=word[0];
	var lostWord=word.substr(1);
	var pattern =
		(prefix ? wordSplitSymbol : "(.|^)" ) +
		"(["+firstLetter.toLowerCase()+firstLetter.toUpperCase()+"])"+lostWord+
		(postfix ? wordSplitSymbol : "(.|$)" );
	var regexp=new RegExp(pattern,"g");
//	console.log(regexp);
	actionArray.push([regexp,"$1$2"+str.substr(1)+"$3"]);
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
	["штол[еь]","что ли"],
	["н[еи]знаю","не знаю"],
	["это-ж","это ж"],
	["падажди","подожди"],
	["во первых","во-первых"],
	["пожалуста","пожалуйста"],
	["безплатно","бесплатно"],
	["досвидание","до свидания"],
	["вс[её]таки","всё-таки"],
	["в кратце","вкратце"],
	["ключь","ключ"],
	["староной","стороной"],
	["немогу","не могу"],
	["во+бщем","в общем"],
	["тожэ","тоже"],
	["такжэ","также"],
	["вобще","вообще"],
	["пожалста","пожалуйста"],
/*	["",""],
	["",""],
	["",""],
	["",""],
/*
	["",""],
*/
];

var orphoPrefixToCorrect=[
	["соеденин","соединен"],
	["симпотич","симпатич"],
	["девч[её]н","девчон"],
	["мущин","мужчин"],
	["большенств","большинств"],
	["седени","сидени"],
	["електр","электр"],
/*
	["",""],
*/
];

var orphoPostfixToCorrect=[
	["борятся","борются"],
	["сыпится","сыпется"],
	["г[ао]в[ао]риш","говоришь"],
	["ються","ются"],
/*
	["",""],
*/
];

var orphoFragmentsToCorrect=[
	["будующ","будущ"],
	["празн","праздн"],
	["призидент","президент"],
	["призедент","президент"],
	["цыкл","цикл"],
	["мед[еи]ц[иы]н","медицин"],
/*
	["",""],
*/
];

var matyuki=[
];

var yo=[
];

for(var i=0; i<orphoWordsToCorrect.length; i++)
	prepareExpression(orphoWordsToCorrect[i][0],orphoWordsToCorrect[i][1],1,1);
for(var i=0; i<orphoPostfixToCorrect.length; i++)
	prepareExpression(orphoPostfixToCorrect[i][0],orphoPostfixToCorrect[i][1],0,1);
for(var i=0; i<orphoPrefixToCorrect.length; i++)
	prepareExpression(orphoPrefixToCorrect[i][0],orphoPrefixToCorrect[i][1],1,0);
for(var i=0; i<orphoFragmentsToCorrect.length; i++)
	prepareExpression(orphoFragmentsToCorrect[i][0],orphoFragmentsToCorrect[i][1],0,0);


function replaceUniversal(ih){
	return ih.
		replace(/[(]{6,}/g,"(((").
		replace(/[)]{6,}/g,")))").
		replace(/([.?!])\1{3,}/g,"$1$1$1");
}

function mainWork(ih){
	ih=replaceUniversal(ih);
	if(notContainsCyrillic(ih)){
		return ih;
	}
	ih=ih.replace(/([А-Яа-яЁё])\1{3,}/g,"$1$1$1");
	ih=ih.replace(/[ь]{2,}/g,"ь");
	ih=ih.replace(/[ъ]{2,}/g,"ъ");

	ih=ih.replace(/([ЖжШшЩщ])[ыЫ]/g,"$1и");
	ih=ih.replace(/([ЧчЩщ])[яЯ]/g,"$1а");
	ih=ih.replace(/([ЧчЩщ])[юЮ]/g,"$1у");
	ih=ih.replace(/ньч/gi,"нч");
	ih=ih.replace(/ньщ/gi,"нщ");
	ih=ih.replace(/чьн/gi,"чн");
	ih=ih.replace(/чьк/gi,"чк");

	ih=ih.replace(/([^А-Яа-яЁёA-Za-z]|^)з(?=[бжкпстф-щБЖКПСТФ-Щ])/gi,"$1с");
	ih=ih.replace(/([^А-Яа-яЁёA-Za-z]|^)З(?=[бжкпстф-щБЖКПСТФ-Щ])/gi,"$1С");

	
	for(var i=0; i<actionArray.length;i++)
		ih=ih.replace(actionArray[i][0],actionArray[i][1]);
	
	return ih;
}

function notContainsCyrillic(str){
	return str.search(/[А-Яа-яЁё]/) === -1;
}

function changeStrings(n, callback, checkLiteralLength) {
	// Эта рекурсивная функция отыскивает все текстовые узлы

	if (n.nodeType == 3 /* Node.TEXT_NODE */){
		n.data=callback(n.data);
	} else if (n.nodeType == 1 /* Node.ELEMENT_NODE */ || n.nodeType == 9 /* document */) {
		//"Срезаем угол" - если кириллицы нет в большом элементе, то незачем его трогать кириллическими регулярками
/*		if(checkLiteralLength){
			//Пока .innerHTML - слишком медленно
			var ih=n.innerHTML;
			var len=ih.length;
			if(len >= minimalLiteralLength && notContainsCyrillic(ih)){
				checkLiteralLength = 0;
				callback = replaceUniversal;
			} else if (len < minimalLiteralLength){
				checkLiteralLength = 0;
			}
		}
*/		// Обратите внимание, обход выполняется с использованием firstChild/nextSibling
		for (var m = n.firstChild; m != null; m = m.nextSibling) {
			changeStrings(m, callback, checkLiteralLength);
		}
	}
}

changeStrings(document.body, mainWork, true);
console.log("chas-correct отработал. Времени затрачено (мс): "+(new Date().getTime() - oldTime));
