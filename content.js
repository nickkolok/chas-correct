/*
Copyright Nikolay Avdeev aka NickKolok aka Николай Авдеев 2015

Всем привет из снежного Воронежа! 

This file is part of CHAS-CORRECT.

    CHAS-CORRECT is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CHAS-CORRECT is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.

  (Этот файл — часть CHAS-CORRECT.

   CHAS-CORRECT - свободная программа: вы можете перераспространять её и/или
   изменять её на условиях Стандартной общественной лицензии GNU в том виде,
   в каком она была опубликована Фондом свободного программного обеспечения;
   либо версии 3 лицензии, либо (по вашему выбору) любой более поздней
   версии.

   CHAS-CORRECT распространяется в надежде, что она будет полезной,
   но БЕЗО ВСЯКИХ ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА
   или ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ. Подробнее см. в Стандартной
   общественной лицензии GNU.

   Вы должны были получить копию Стандартной общественной лицензии GNU
   вместе с этой программой. Если это не так, см.
   <http://www.gnu.org/licenses/>.)
*/

'use strict';

var minimalLiteralLength=204800; //Пока с потолка

Array.prototype.spliceWithLast=function(index){
	'use strict';
	this[index]=this[this.length-1];
	this.length--;
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

//Кэшируем строки и регэкспы. Вроде как помогает.
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

	correct.replacedPairs.push(ih);
	for(var i=0; i<actionArray.length;i++){
//		if(actionArray[i])
	/*	if(ih.length>50 && /\./.test(ih)){
			var temparr=ih.split(".");
			var len=temparr.length;
			for(var j=0; j<len; j++){
				if(actionArray[i][2].test(temparr[j]))
					temparr[j]=temparr[j].replace(actionArray[i][0],actionArray[i][1]);
			}
			ih=temparr.join(".");
		}else
	*/	
		if(actionArray[i][2].test(ih))
			ih=ih.replace(actionArray[i][0],actionArray[i][1]);
	}
	correct.replacedPairs.push(ih);

	return ih;
}

var regCyr=/[А-Яа-яЁё]/;
function notContainsCyrillic(str){
	return !regCyr.test(str);
}

var textNodesText=[];
var textNodes=[];
var kuch=3;

function updateTextNodes() {
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
var typicalNodes;
var lastActionArrayLength=$.jStorage.get("lastActionArrayLength",0);
if(lastActionArrayLength==actionArrayCopy.length){
	typicalNodes=$.jStorage.get("chas-correct-typical-nodes",{totalPages:0,nodes:{}});
}else{
	typicalNodes={totalPages:0,nodes:{}};
	$.jStorage.set("lastActionArrayLength",actionArrayCopy.length);
	correct.log("Длина словаря изменилась - сбрасываем кэш");
}

var flagEchoMessageDomChanged;
var flagFixMistakesScheduled=0;
var flagAsyncFixLoopFinished=1;
var flagFirstTimeFixLaunch=1;
var firstChangingNode,lastChangingNode;
var timeBeforeMain;

function fixMistakes(){
	var oldTime2=new Date().getTime();

/*	if(!flagAsyncFixLoopFinished){
		if(!flagFixMistakesScheduled){
			setTimeout(fixMistakes,20);
			flagFixMistakesScheduled=1;
		}
		return;
	}
*/	updateTextNodes();
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
	timeBeforeMain=new Date().getTime();
	
	firstChangingNode=i;//TODO: зарефакторить
	lastChangingNode=len;
/*	if(flagFirstTimeFixLaunch){
		setTimeout(asyncFixLoop,0);
	}else{
		asyncFixLoop();
	}
*/
//	flagFixMistakesScheduled=0;
	asyncFixLoop();
	flagFirstTimeFixLaunch=0;
	flagEchoMessageDomChanged=1;
}

fixMistakes();

var asyncFixLoopStartTime;
var asyncCount=0;
function asyncFixLoop(){
	asyncCount++;
	asyncFixLoopStartTime=new Date().getTime();
	flagEchoMessageDomChanged=1;
	for(;firstChangingNode<=lastChangingNode;firstChangingNode++){
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
		if(textNodes[firstChangingNode] && !(textNodes[firstChangingNode].data in typicalNodes.nodes))
			textNodes[firstChangingNode].data=mainWork(textNodes[firstChangingNode].data);
//		else
//			correct.log(textNodes[i].data);
/*		if(
		(firstChangingNode % 100 == 0)
			// || (new Date().getTime() - asyncFixLoopStartTime > 146)
		){
			firstChangingNode++;
			setTimeout(asyncFixLoop,10);
			return;
		}
*/
	}
	correct.log("Основной цикл (мс): "+(new Date().getTime() - timeBeforeMain));
	flagAsyncFixLoopFinished=1;
	actionsAfterFixLoop();
}
function actionsAfterFixLoop(){
	setTimeout(analizeFreq,1000);
	observeDOM(document.body, domChangedHandler);
	setTimeout(cacheTypicalNodes,3000);
	correct.log("chas-correct отработал. Времени затрачено (мс): "+(new Date().getTime() - oldTime));
	correct.log("Доля нод с ошибками: "+(errorNodes/textNodes.length)+", "+errorNodes+" из "+textNodes.length);
	correct.log("Асихронных циклов: "+asyncCount);
	correct.logToConsole();
}

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


function analizeFreqInRegExp(min){
	var freqStat=$.jStorage.get("chas-correct-freq-stat",{totalNodes:0,includes:{}});
	var rez={};
	var sum=0;
	for(var i=0; i < freqKeys.length; i++){
		var reg=new RegExp(freqKeys[i],"i");
		rez[freqKeys[i]] = 0;
		for(var j=0; j<actionArrayCopy.length; j++){
			if(reg.test(actionArrayCopy[j][0].source.replace(/\[.*?\]/g,"")))
				rez[freqKeys[i]]++;
		}
		var f=rez[freqKeys[i]]/actionArrayCopy.length * (1 - freqStat.includes[freqKeys[i]]/freqStat.totalNodes);
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
	if(newt - domChangedLastTime < 1468){
		if(!domChangedScheduled){
			domChangedScheduled=1;
			setTimeout(domChangedHandler,1468);
		}
		return;
	}
	console.log(newt);
	domChangedLastTime=new Date().getTime();
	domChangedScheduled=0;
	fixMistakes();
	correct.log("Вызов chas-correct по смене DOM: "+(new Date().getTime() - newt)+" мс");
	correct.logToConsole();
}


//Кэширование типичных нод
function cacheTypicalNodes(){
	typicalNodes.totalPages++;
	//Добавляем найденные ноды
	for(var i=0; i<textNodes.length; i++){
		var t=textNodes[i].data;
		typicalNodes.nodes[t]||(typicalNodes.nodes[t]=0);
		typicalNodes.nodes[t]+=20;
	}
	//Чистим те, у которых частота меньше 0
	for(var text in typicalNodes.nodes){
		typicalNodes.nodes[text]--;
		if(typicalNodes.nodes[text] < 0){
			delete typicalNodes.nodes[text];
		}
	}
	$.jStorage.set("chas-correct-typical-nodes",typicalNodes);
}


//Объединение текста всех нод и выкидывание ненужных регулярок

//var textArr;//=[];
var text="";
function selectRegs(i,len){
//	textArr=[];
//	megaexpressionParts=[];
	text="";
	var megaexpressionSource="(";
	var delimiter=")|(";
	var t=new Date().getTime();
	actionArray=actionArrayCopy.slice();//Да, так быстрее: http://jsperf.com/array-slice-vs-push
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
	megaexpression=new RegExp(megaexpressionSource.replace(/\)\|\($/,"")+")","im");
//	correct.log(megaexpression);
	correct.log("Выбор регэкспов, мс: "+(new Date().getTime()-t));
}

//Сбросить кэш
function clearNodeCache(){
	$.jStorage.set("chas-correct-typical-nodes",{totalPages:0,nodes:{}});
}

//Расстановка типографики
document.onkeydown = function(e) {
    e = e || event;
	if ((e.ctrlKey && e.shiftKey && e.keyCode == "A".charCodeAt(0))) {
        forceTypo();
        return false;
    }
}

function forceTypo(){
	updateTextNodes();
	var len=textNodes.length;
	for(var i=0; i<len; i++)
		textNodes[i].data=forceTypoInString(textNodes[i].data);
}

//var typoLeft=/ *([,\.!?\):;])( *(?![,\.!?\):;]))/g;
var typoLeft=/ *([,\.!?\):;»]) */g;
var typoRight=/ *([\(«]) */g;
var typoJoin=/([,\.!?\):;]+) *([,\.!?\):;»]+)/g;
var typoSmallLetter=/([а-яё]{2,}[\.!?]) *[а-яё]/g;
function replaceSmallLetter(m,$1){
	console.log(m, $1);
	return $1+" "+m.substr(-1).toUpperCase();
}

function forceTypoInString(ih){
		return ih.
			replace(typoLeft , "$1 ").
			replace(typoRight, " $1").
			replace(typoJoin , "$1$2").
			replace(typoJoin , "$1$2").
			replace(typoSmallLetter,replaceSmallLetter)
			;
}
