'use strict';

var wordSplitSymbol="([^А-Яа-яЁёA-Za-z]|^|$)";
var leftEnd="(.|[\s\S]|^)";
var rightEnd="(.|[\s\S]|$)";
var actionArray=[
	[/[ь]{2,}/g,"ь",/ьь/i],
	[/[ъ]{2,}/g,"ъ",/ъъ/i],

	[/([ЖжШшЩщ])[ыЫ]/g,"$1и",/[жшщ]ы/i],
	[/([ЧчЩщ])[яЯ]/g,"$1а",/[чщ]я/i],
	[/([ЧчЩщ])[юЮ]/g,"$1у",/[чщ]ю/i],
	[/([^А-Яа-яЁёA-Za-z]|^)з(?=[бжкпстф-щБЖКПСТФ-Щ]|д(?!ани|ань|ес|еш|оров|рав))/g,"$1с",/([^А-Яа-яЁёA-Za-z]|^)з(?=[бджкпстф-щБДЖКПСТФ-Щ])/],
	[/([^А-Яа-яЁёA-Za-z]|^)З(?=[бжкпстф-щБЖКПСТФ-Щ]|д(?!ани|ань|ес|еш|оров|рав))/g,"$1С",/([^А-Яа-яЁёA-Za-z]|^)З(?=[бджкпстф-щБДЖКПСТФ-Щ])/],
];
var minimalLiteralLength=204800; //Пока с потолка

Array.prototype.spliceWithLast=function(index){
	'use strict';
	this[index]=this[this.length-1];
	this.length--;
}

function prepareExpression(word, str, prefix, postfix){
	if(word[0] !== str[0])
		return prepareReplaceHeavy(word, str, prefix, postfix);
	var firstLetter=word[0];
	var lostWord=word.substr(1);
	var pattern =
		(prefix ? wordSplitSymbol : leftEnd ) +
		"(["+firstLetter.toLowerCase()+firstLetter.toUpperCase()+"])"+lostWord+
		(postfix ? wordSplitSymbol : rightEnd );
	var regexp=new RegExp(pattern,"gm");
//	correct.log(regexp);
	actionArray.push([regexp,"$1$2"+str.substr(1)+"$3",new RegExp(word,"i")]);
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
//			megaexpressionParts.push(globalArray[i1][i2][i][0]);
		}

var actionArrayCopy=actionArray.slice();

var megaexpression;//=new RegExp("("+megaexpressionParts.join(")|(")+")","im");

correct.log("chas-correct: на подготовку массива регулярных выражений затрачено (мс): "+(new Date().getTime() - oldTime));

//Кэщируем строки и регэкспы. Вроде как помогает.
var reun1=/[(]{6,}/g		, stun1="(((";
var reun2=/[)]{6,}/g		, stun2=")))";
var reun3=/[!]1+/g			, stun3="!";
var reun4=/[?]7+/g			, stun4="?";
var reun5=/([.?!])\1{3,}/g	, stun5="$1$1$1";
function replaceUniversal(ih){
	return ih.
		replace(reun1,stun1).
		replace(reun2,stun2).
		replace(reun3,stun3).
		replace(reun4,stun4).
		replace(reun5,stun5);
}

function prepareReplaceHeavy(reg, str, prefix, postfix){
	var lostreg=reg.substr(1);
	var loststr=str.substr(1);
	var pattern1 =
		(prefix ? wordSplitSymbol : leftEnd ) +
		reg[0].toLowerCase()+lostreg+
		(postfix ? wordSplitSymbol : rightEnd );
	var regexp1=new RegExp(pattern1,"gm");
	var pattern2 =
		(prefix ? wordSplitSymbol : leftEnd ) +
		reg[0].toUpperCase()+lostreg+
		(postfix ? wordSplitSymbol : rightEnd );
	var regexp2=new RegExp(pattern2,"gm");
	actionArray.push([regexp1,"$1"+str[0].toLowerCase()+loststr+"$2",new RegExp(reg,"i")]);
	actionArray.push([regexp2,"$1"+str[0].toUpperCase()+loststr+"$2",new RegExp(reg,"i")]);
}


var reg3podryad=/([А-Яа-яЁё])\1{3,}/g;
function specialWork(ih){
	ih=ih.replace(reg3podryad,"$1$1$1");//Это не выносится из-за сигнатуры

/*//Перенесено в словарь
	ih=ih.replace(/ньч/gi,"нч");
	ih=ih.replace(/ньщ/gi,"нщ");
	ih=ih.replace(/чьн/gi,"чн");
	ih=ih.replace(/щьн/gi,"щн");
	ih=ih.replace(/чьк/gi,"чк");
*/	
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
//		if(actionArray[i])
			ih=ih.replace(actionArray[i][0],actionArray[i][1]);

	return ih;
}

var regCyr=/[А-Яа-яЁё]/;
function notContainsCyrillic(str){
	return !regCyr.test(str);
}

var textNodesText=[];
var textNodes=[];
var kuch=3;

function nativeTreeWalker() {
	var walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);

	var node;
	textNodes = [];

	while(node = walker.nextNode()) {
		if(node.data!="" && node.data.trim()!=""){
			node.data=replaceUniversal(node.data);
			if(!notContainsCyrillic(node.data)){
				textNodes.push(node);
			}
		}
	}
}

var regKnown;
var typicalNodes=$.jStorage.get("chas-correct-typical-nodes",{totalPages:0,nodes:{}});

var flagEchoMessageDomChanged;

function fixMistakes(){
	var oldTime2=new Date().getTime();
	textNodes=[];
	nativeTreeWalker();
	correct.log("chas-correct: на подготовку массива текстовых нод затрачено (мс): "+(new Date().getTime() - oldTime2));

	var len=textNodes.length-1;
	var i=0;

	var oldTime3=new Date().getTime();


	var timeBeforeHeader=new Date().getTime();
	if(typicalNodes.nodes){
		//Пропускаем "шапку" страницы
		while(i<=len && textNodes[i].data in typicalNodes.nodes){
			i++;
		};
		//И низушку
		while(i<=len && textNodes[len].data in typicalNodes.nodes){
			len--;
		};
	}
	len++;//Иначе глючит :(
	var cachedNodes=i+textNodes.length-len;
	correct.log("Нод отнесено к шапке: "+cachedNodes+"("+(cachedNodes/textNodes.length*100)+"%), до "+i+"-й и после "+(len-1)+"-й");
	correct.log("Выделение шаблона (мс): "+(new Date().getTime() - timeBeforeHeader));


	selectRegs(i,len);
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
		if(textNodes[i] && !(textNodes[i].data in typicalNodes.nodes))
			textNodes[i].data=mainWork(textNodes[i].data);
//		else
//			correct.log(textNodes[i].data);

	}
	flagEchoMessageDomChanged=1;
	correct.log("Основной цикл (мс): "+(new Date().getTime() - timeBeforeMain));
}

fixMistakes();

correct.log("chas-correct отработал. Времени затрачено (мс): "+(new Date().getTime() - oldTime));
correct.log("Доля нод с ошибками: "+(errorNodes/totalNodes));

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
	if(flagEchoMessageDomChanged){
		flagEchoMessageDomChanged=0;
		return;
	}
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

//Объединение текста всех нод и выкидывание ненужных регулярок

//var textArr;//=[];
function selectRegs(i,len){
	var text="";
//	textArr=[];
//	megaexpressionParts=[];
	var megaexpressionSource="(";
	var delimiter=")|(";
	var t=new Date().getTime();
	actionArray=actionArrayCopy.slice();
	for(;i<len;i++){
		if(!(textNodes[i].data in typicalNodes.nodes))
//			textArr.push(textNodes[i].data);
			text+=" "+textNodes[i].data;
	}
//	var text=textArr.join(" ");
//	correct.log(text);
	var l=actionArray.length;
	for(var j=0; j<l; j++){
		if(actionArray[j] && actionArray[j][2]){
			if(!actionArray[j][2].test(text)){
//				correct.log(actionArray[j][2]);
				actionArray.spliceWithLast(j);
				l--;
				j--;
//				actionArray[j]=0;
			}else{
//				megaexpressionParts.push(actionArray[j][2].source);
				megaexpressionSource+=actionArray[j][2].source+delimiter;
			}
		}
	}
//	megaexpression=new RegExp("("+megaexpressionParts.join(")|(")+")","im");
	megaexpression=new RegExp(megaexpressionSource+")","im");
	correct.log("Выбор регэкспов, мс: "+(new Date().getTime()-t));
}

//Сбросить кэш
function clearNodeCache(){
	$.jStorage.set("chas-correct-typical-nodes",{totalPages:0,nodes:{}});
}





correct.logToConsole();
