var wordSplitSymbol="([^А-Яа-яЁёA-Za-z]|^|$)";
var actionArray=[];
var minimalLiteralLength=204800; //Пока с потолка


function prepareExpression(word, str, prefix, postfix){
	if(word[0] !== str[0])
		return prepareReplaceHeavy(word, str, prefix, postfix);
	var firstLetter=word[0];
	var lostWord=word.substr(1);
	var pattern =
		(prefix ? wordSplitSymbol : "(.|[\s\S]|^)" ) +
		"(["+firstLetter.toLowerCase()+firstLetter.toUpperCase()+"])"+lostWord+
		(postfix ? wordSplitSymbol : "(.|[\s\S]|$)" );
	var regexp=new RegExp(pattern,"gm");
//	console.log(regexp);
	actionArray.push([regexp,"$1$2"+str.substr(1)+"$3"]);
}

var megaexpressionParts=[];

var globalArray=[
	[orphoFragmentsToCorrect,orphoPostfixToCorrect],
	[orphoPrefixToCorrect,orphoWordsToCorrect],
];

for(var i1=0; i1<=1;i1++)
	for(var i2=0; i2<=1;i2++)
		for(var i=0; i<globalArray[i1][i2].length; i++){
			prepareExpression(globalArray[i1][i2][i][0],globalArray[i1][i2][i][1],i1,i2);
			megaexpressionParts.push(globalArray[i1][i2][i][0]);
		}
/*
for(var i=0; i<orphoWordsToCorrect.length; i++)
	prepareExpression(orphoWordsToCorrect[i][0],orphoWordsToCorrect[i][1],1,1);
for(var i=0; i<orphoPostfixToCorrect.length; i++)
	prepareExpression(orphoPostfixToCorrect[i][0],orphoPostfixToCorrect[i][1],0,1);
for(var i=0; i<orphoPrefixToCorrect.length; i++)
	prepareExpression(orphoPrefixToCorrect[i][0],orphoPrefixToCorrect[i][1],1,0);
for(var i=0; i<orphoFragmentsToCorrect.length; i++)
	prepareExpression(orphoFragmentsToCorrect[i][0],orphoFragmentsToCorrect[i][1],0,0);
*/

var megaexpression=new RegExp("("+megaexpressionParts.join(")|(")+")","im");

console.log("chas-correct: на подготовку массива регулярных выражений затрачено (мс): "+(new Date().getTime() - oldTime));

function replaceUniversal(ih){
	return ih.
		replace(/[(]{6,}/g,"(((").
		replace(/[)]{6,}/g,")))").
		replace(/([.?!])\1{3,}/g,"$1$1$1");
}

function prepareReplaceHeavy(reg, str, prefix, postfix){
	var lostreg=reg.substr(1);
	var loststr=str.substr(1);
	var pattern1 =
		(prefix ? wordSplitSymbol : "(.|[\s\S]|^)" ) +
		reg[0].toLowerCase()+lostreg+
		(postfix ? wordSplitSymbol : "(.|[\s\S]|$)" );
	var regexp1=new RegExp(pattern1,"gm");
	var pattern2 =
		(prefix ? wordSplitSymbol : "(.|[\s\S]|^)" ) +
		reg[0].toUpperCase()+lostreg+
		(postfix ? wordSplitSymbol : "(.|[\s\S]|$)" );
	var regexp2=new RegExp(pattern2,"gm");
	actionArray.push([regexp1,"$1"+str[0].toLowerCase()+loststr+"$2"]);
	actionArray.push([regexp2,"$1"+str[0].toUpperCase()+loststr+"$2"]);
}

function specialWork(ih){
//	lAr.push(ih.length);
	
	ih=ih.replace(/([А-Яа-яЁё])\1{3,}/g,"$1$1$1");
	ih=ih.replace(/[ь]{2,}/g,"ь");
	ih=ih.replace(/[ъ]{2,}/g,"ъ");

	ih=ih.replace(/([ЖжШшЩщ])[ыЫ]/g,"$1и");
	ih=ih.replace(/([ЧчЩщ])[яЯ]/g,"$1а");
	ih=ih.replace(/([ЧчЩщ])[юЮ]/g,"$1у");
	ih=ih.replace(/ньч/gi,"нч");
	ih=ih.replace(/ньщ/gi,"нщ");
	ih=ih.replace(/чьн/gi,"чн");
	ih=ih.replace(/щьн/gi,"щн");
	ih=ih.replace(/чьк/gi,"чк");

	ih=ih.replace(/([^А-Яа-яЁёA-Za-z]|^)з(?=[бжкпстф-щБЖКПСТФ-Щ]|д(?!ани|ань|ес|еш|оров|рав))/g,"$1с");
	ih=ih.replace(/([^А-Яа-яЁёA-Za-z]|^)З(?=[бжкпстф-щБЖКПСТФ-Щ]|д(?!ани|ань|ес|еш|оров|рав))/g,"$1С");
	
	return ih;
}

var lAr=[];
var totalNodes=0;
var errorNodes=0;

function mainWork(ih){
	ih=specialWork(ih);

	totalNodes++;

	if(!megaexpression.test(ih))
		return ih;

	errorNodes++;

	for(var i=0; i<actionArray.length;i++)
		ih=ih.replace(actionArray[i][0],actionArray[i][1]);

	return ih;
}

function notContainsCyrillic(str){
	return str.search(/[А-Яа-яЁё]/) === -1;
}

var textNodesText=[];
var textNodes=[];

function changeStrings(n, callback, checkLiteralLength) {
	// Эта рекурсивная функция отыскивает все текстовые узлы

	if (n.nodeType == 3 /* Node.TEXT_NODE */){
		n.data=replaceUniversal(n.data);
		if(notContainsCyrillic(n.data)){
			return;
		}
		textNodes.push(n);
//		n.data=callback(n.data);
	} else if (n.nodeType == 1 /* Node.ELEMENT_NODE */ || n.nodeType == 9 /* document */) {
/*		if(checkLiteralLength){
			//Пока .innerHTML - слишком медленно
			var ih=n.innerHTML;
			var len=ih.length;
			if(len >= minimalLiteralLength && !megaexpression.test(ih)){
				checkLiteralLength = 0;
				callback = specialWork;
			} else if (len < minimalLiteralLength){
				checkLiteralLength = 0;
			}
		}
*/		//"Срезаем угол" - если кириллицы нет в большом элементе, то незачем его трогать кириллическими регулярками
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

/*
		if(!(i%10)){
			textNodesText[i/10]=[n.data];
		}else{
			textNodesText[i/10].push(n.data);
		}

*/
var kuch=3;

changeStrings(document.body, mainWork, true);

console.log("chas-correct: на подготовку массива текстовых нод затрачено (мс): "+(new Date().getTime() - oldTime));

var len=textNodes.length;
for(var i=0;i<len;i++){
/*	var textArr=[];
	if(i%kuch == 0){
		for(var j=0; (i+j<len) && (j<kuch); j++){
			textArr.push(textNodes[i+j].data);
		}
		if(!megaexpression.test(textArr.join(" "))){
			i+=kuch;
			continue;
		}
	}
*/	textNodes[i].data=mainWork(textNodes[i].data);
}


//console.log(textNodesText.join(" "));
console.log("chas-correct отработал. Времени затрачено (мс): "+(new Date().getTime() - oldTime));
console.log("Доля нод с ошибками: "+(errorNodes/totalNodes));
/*

var smAr=[];
for(var i=0;i<lAr.length;i++)
	if(lAr[i]<10)
		smAr.push(lAr[i]);

*/

var freqKeys="абвгдеёжзийклмнопрстуфхцчшщъыьэюя".split("").concat(["ть*с"]);

function analizeFreq(){
	var freqStat=$.jStorage.get("chas-correst-freq-stat",{totalNodes:0,includes:{}});
	freqStat.totalNodes += textNodes.length;
	for(var i=0; i < freqKeys.length; i++){
		var reg=new RegExp(freqKeys[i],"i");
		freqStat.includes[freqKeys[i]] || (freqStat.includes[freqKeys[i]] = 0);
		for(var j=0; j < textNodes.length; j++){
			if(reg.test(textNodes[j].data))
				freqStat.includes[freqKeys[i]]++;
			}
	}
	$.jStorage.set("chas-correst-freq-stat",freqStat);
}

function logFreq(max){
	var freqStat=$.jStorage.get("chas-correst-freq-stat",{totalNodes:0,includes:{}});
	for(var i=0; i < freqKeys.length; i++){
		var f=freqStat.includes[freqKeys[i]]/freqStat.totalNodes;
		if(!(f>max))
			console.log(freqKeys[i]+": "+f);
	}
}

setTimeout(analizeFreq,1000);

function analizeFreqInRegExp(min){
	var freqStat=$.jStorage.get("chas-correst-freq-stat",{totalNodes:0,includes:{}});
	var rez={};
	var sum=0;
	for(var i=0; i < freqKeys.length; i++){
		var reg=new RegExp(freqKeys[i],"i");
		rez[freqKeys[i]] = 0;
		for(var j=0; j<actionArray.length; j++){
			if(reg.test(actionArray[j][0].source.replace(/\[.*?\]/g,"")))
				rez[freqKeys[i]]++;
		}
		var f=rez[freqKeys[i]]/actionArray.length * (1 - freqStat.includes[freqKeys[i]]/freqStat.totalNodes);
		sum+=f;
		if(!(f<min))
			console.log(freqKeys[i]+": "+f);
	}
	return sum;
}
