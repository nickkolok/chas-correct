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
//	correct.log(regexp);
	actionArray.push([regexp,"$1$2"+str.substr(1)+"$3"]);
//	megaexpressionParts.push(pattern);
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

correct.log("chas-correct: на подготовку массива регулярных выражений затрачено (мс): "+(new Date().getTime() - oldTime));

function replaceUniversal(ih){
	return ih.
		replace(/[(]{6,}/g,"(((").
		replace(/[)]{6,}/g,")))").
		replace(/[!]1+/g,"!").
		replace(/[?]7+/g,"?").
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
//	correct.log(ih.match(megaexpression));

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

var regKnown;
var typicalNodes=$.jStorage.get("chas-correct-typical-nodes",{totalPages:0,nodes:{}});

function fixMistakes(){
	var oldTime2=new Date().getTime();
	textNodes=[];
	changeStrings(document.body, mainWork, true);

	correct.log("chas-correct: на подготовку массива текстовых нод затрачено (мс): "+(new Date().getTime() - oldTime2));

/*	var oldTime3=new Date().getTime();

	var known=[];
	if(typicalNodes.totalPages){
		for(var text in typicalNodes.nodes){
			var f=typicalNodes.nodes[text]/typicalNodes.totalPages;
			if(f>0.2){
				known.push(text);
			}
		}
	}
//	correct.log(known);
	var k=!!known.length;
	try{
		regKnown=new RegExp("^("+
			known.join(")|(").
			replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&").//Без паники, сейчас вернём скобки!
			replace(/\\\)\\\|\\\(/g,")|(").
			replace(/^\\\(/g,"(").
			replace(/\\\)$/g,")")
			+
		")$");
	}catch(e){
		k=0;
	}
//	correct.log(regKnown);
	correct.log("chas-correct: на подготовку регулярки типичных нод затрачено (мс): "+(new Date().getTime() - oldTime3));
*/	
	var len=textNodes.length-1;
	var i=0;
/*	
	var timeBeforeHeader=new Date().getTime();
	if(typicalNodes.nodes){
		//Пропускаем "шапку" страницы
//		while(i<=len && regKnown.test(textNodes[i].data)){
		while(i<=len && textNodes[i].data in typicalNodes.nodes){
			i++;
		};
		//И низушку
//		while(i<=len && regKnown.test(textNodes[len].data)){
		while(i<=len && textNodes[len].data in typicalNodes.nodes){
			len--;
		};
	}
	var cachedNodes=i+textNodes.length-len-1;
	correct.log("Нод отнесено к шапке: "+cachedNodes+"("+(cachedNodes/textNodes.length*100)+"%), до "+i+"-й и после "+(len-1)+"-й");
	correct.log("Выделение шаблона (мс): "+(new Date().getTime() - timeBeforeHeader));
*/

	var timeBeforeMain=new Date().getTime();
	
	for(;i<=len;i++){
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
	*/	
		if(!(textNodes[i].data in typicalNodes.nodes))
			textNodes[i].data=mainWork(textNodes[i].data);
//		}else{
//			console.log(textNodes[i].data);
//		}
	}
	correct.log("Основной цикл (мс): "+(new Date().getTime() - timeBeforeMain));
}

fixMistakes();

correct.log("chas-correct отработал. Времени затрачено (мс): "+(new Date().getTime() - oldTime));
correct.log("Доля нод с ошибками: "+(errorNodes/totalNodes));

//console.log(textNodesText.join(" "));
/*

var smAr=[];
for(var i=0;i<lAr.length;i++)
	if(lAr[i]<10)
		smAr.push(lAr[i]);

*/

var freqKeys="абвгдеёжзийклмнопрстуфхцчшщъыьэюя".split("").concat(["ть*с","не","ни"]);

function analizeFreq(){
	var freqStat=$.jStorage.get("chas-correct-freq-stat",{totalNodes:0,includes:{}});
	freqStat.totalNodes += textNodes.length;
	for(var i=0; i < freqKeys.length; i++){
		var reg=new RegExp(freqKeys[i],"i");
		freqStat.includes[freqKeys[i]] || (freqStat.includes[freqKeys[i]] = 0);
		for(var j=0; j < textNodes.length; j++){
			if(reg.test(textNodes[j].data))
				freqStat.includes[freqKeys[i]]++;
			}
	}
	$.jStorage.set("chas-correct-freq-stat",freqStat);
}

function logFreq(max){
	var freqStat=$.jStorage.get("chas-correct-freq-stat",{totalNodes:0,includes:{}});
	for(var i=0; i < freqKeys.length; i++){
		var f=freqStat.includes[freqKeys[i]]/freqStat.totalNodes;
		if(!(f>max))
			console.log(freqKeys[i]+": "+f);
	}
}

setTimeout(analizeFreq,1000);

function analizeFreqInRegExp(min){
	var freqStat=$.jStorage.get("chas-correct-freq-stat",{totalNodes:0,includes:{}});
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

var domChangedLastTime=new Date().getTime();
var domChangedScheduled=0;

function domChangedHandler(){
	var newt=new Date().getTime();
	if(newt - domChangedLastTime < 1000){
		if(!domChangedScheduled){
			domChangedScheduled=1;
			setTimeout(domChangedHandler,1000);
		}
		return;
	}
	fixMistakes();
	correct.log("Вызов chas-correct по смене DOM: "+(new Date().getTime() - newt)+" мс");
	correct.logToConsole();
	domChangedScheduled=0;
}

var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

// Observe a specific DOM element:
observeDOM(document.body, domChangedHandler);

//Самообучение на типичных нодах
function autoteachTypicalNodes(){
	typicalNodes.totalPages++;
//	typicalNodes.totalPages=1;
	//Добавляем найденные ноды
	for(var i=0; i<textNodes.length; i++){
		var t=textNodes[i].data;
		typicalNodes.nodes[t]||(typicalNodes.nodes[t]=0);
		typicalNodes.nodes[t]++;
	}
	//Чистим те, у которых частота меньше 0.05
	for(var text in typicalNodes.nodes){
		var f=typicalNodes.nodes[text]/typicalNodes.totalPages;
		if(f<0.05){
			delete typicalNodes.nodes[text];
		}
	}
	$.jStorage.set("chas-correct-typical-nodes",typicalNodes);
}

setTimeout(autoteachTypicalNodes,3000);
