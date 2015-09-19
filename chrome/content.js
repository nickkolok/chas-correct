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
    along with CHAS-CORRECT.  If not, see <http://www.gnu.org/licenses/>.

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

Array.prototype.spliceWithLast=function(index){
	///Заменить элемент под номером index последним, последний удалить
	///Это, очевидно, эффективнее, чем сдвигать весь массив и даже чем просто заменять на null
	'use strict';
	this[index]=this[this.length-1];
	this.length--;
};

var storageWrapper={
	///Обёртка над хранилищем, в данном случае - localStorage. Для адаптации под GreaseMonkey править тут
	getKey: function(key,defaultValue){
		return JSON.parse(localStorage.getItem(key)) || defaultValue;
	},
	setKey: function(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
};

var observeDOM = (function(){
	///Наблюдение за DOM и вызок корректора при добавлении новых нод
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
		eventListenerSupported = window.addEventListener;

	return function(obj, callback){
		if( MutationObserver ){
			// define a new observer
			var obs = new MutationObserver(function(mutations, observer){
				var len=mutations.length;
				for(var i=0; i<len; i++){
					//TODO: гонять проверялку только по тем нодам, которые добавились
					//Сложность в том, что добавиться могло целое дерево
					if(mutations[i].addedNodes.length){
						callback();
						break;
					}
				}
			});
			// have the observer observe foo for changes in children
			obs.observe( obj, { childList:true, subtree:true });
		}
		else if( eventListenerSupported ){
			obj.addEventListener('DOMNodeInserted', callback, false);
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

var textNodes=[];
var kuch=3;

function extractTextNodesFrom(rootNode) {
	///Добавить все текстовые ноды-потомки rootNode в масссив textNodes
	var walker = document.createTreeWalker(
		rootNode,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);

	var node;

	while(node = walker.nextNode()) {
		if(node.data!="" && node.data.trim()!=""){
			node.data=replaceUniversal(node.data);
			if(!notContainsCyrillic(node.data)){
				textNodes.push(node);
			}
		}
	}
}

function extractAllTextNodes() {
	///Заменить textNodes на список
	var timeBeforeNodesExtracting=new Date().getTime();
	textNodes=[];
	extractTextNodesFrom(document.body);
	correct.logTimestamp("На подготовку массива текстовых нод затрачено", timeBeforeNodesExtracting);
}

var regKnown;
var typicalNodes;
var lastActionArrayLength=storageWrapper.getKey("lastActionArrayLength",0);
if(lastActionArrayLength==actionArrayCopy.length){
	typicalNodes=storageWrapper.getKey("chas-correct-typical-nodes",{totalPages:0,nodes:{}});
}else{
	typicalNodes={totalPages:0,nodes:{}};
	storageWrapper.setKey("lastActionArrayLength",actionArrayCopy.length);
	correct.log("Длина словаря изменилась - сбрасываем кэш");
}

var flagEchoMessageDomChanged;
var flagFixMistakesScheduled=0;
var flagAsyncFixLoopFinished=1;
var flagFirstTimeFixLaunch=1;
var firstChangingNode,lastChangingNode;
var timeBeforeMain;

function fixMistakes(){
/*	if(!flagAsyncFixLoopFinished){
		if(!flagFixMistakesScheduled){
			setTimeout(fixMistakes,20);
			flagFixMistakesScheduled=1;
		}
		return;
	}
*/
	extractAllTextNodes();

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
	correct.logTimestamp("Выделение шаблона", timeBeforeHeader);


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
	correct.logTimestamp("Основной цикл", timeBeforeMain);
	flagAsyncFixLoopFinished=1;
	actionsAfterFixLoop();
}
function actionsAfterFixLoop(){
//	setTimeout(analizeFreq,1000);
	observeDOM(document.body, domChangedHandler);
	setTimeout(cacheTypicalNodes,3000);
	correct.logTimestamp("chas-correct отработал. Времени затрачено", oldTime);
	correct.logToConsole();
}

var domChangedLastTime=new Date().getTime();
var keydownLastTime=new Date().getTime();
var domChangedScheduled=0;
var domChangeTimes=0;

var domChangingTimeout=0;

function scheduleDomChangeHandler(time){
	clearTimeout(domChangingTimeout);
	domChangingTimeout=setTimeout(domChangedHandler,time);
}

function domChangedHandler(){
	var newt=new Date().getTime();
	if(flagEchoMessageDomChanged){
		flagEchoMessageDomChanged=0;
		return;
	}
	if(newt - domChangedLastTime < 1468 || newt - keydownLastTime < 2*1468){
//		if(!domChangedScheduled){
//			domChangedScheduled=1;
			scheduleDomChangeHandler(1468);
//		}
		return;
	}
	domChangedLastTime=new Date().getTime();
	domChangedScheduled=0;
	fixMistakes();
	domChangeTimes++;
	correct.logTimestamp("Вызов chas-correct по смене DOM "+domChangeTimes+"-й раз", newt);
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

	//Здесь и далее ограничиваем кэш - по длине и по количеству нод
	//Считаем количество нод в кэше
	var cacheNodesCount=0;
	var lastNode;
	//И попутно выкидываем не встречавшиеся более 20 страниц
	for(var text in typicalNodes.nodes){
		cacheNodesCount++;
		typicalNodes.nodes[text]--;
		if(typicalNodes.nodes[text] < 0){
			delete typicalNodes.nodes[text];
		}
	}

	var cacheLength=JSON.stringify(typicalNodes.nodes).length;

	var currentMin;
	for(;
		//Ограничиваем кэш 100 килобайтами на сайт (или 200, т. к. юникод? Не важно)
		cacheLength > 102400
	||
		//Не более 1024 нод
		cacheNodesCount > 1024
	;){
//	console.log("В кэше нод: "+cacheNodesCount+" общей длиной "+cacheLength);
		for(var text in typicalNodes.nodes){
			break;
		}
		//Да, это так мы получаем первую ноду из кэша
		//Считаем её минимальной
		currentMin = Math.pow(typicalNodes.nodes[text ],2)/( typicalNodes.nodes[text ].length + 6);
		//Ищем ноду с минимальным отношением квадрата повторяемости к длине
		for(var text2 in typicalNodes.nodes){
			if( Math.pow(typicalNodes.nodes[text2],2)/( typicalNodes.nodes[text2].length + 6) < currentMin ){
				text = text2;
				currentMin = Math.pow(typicalNodes.nodes[text ],2)/( typicalNodes.nodes[text ].length + 6);
			}
		}
		//Удаляем одну ноду
		delete typicalNodes.nodes[text];

		//Пересчитываем показатели
		cacheNodesCount--;
		cacheLength -= text.length-6;

		//Эталонной нодой снова становится последняя
		text = lastNode;
	}

	//Нечего память кушать! Надо будет - новые нагенерятся
	textNodes=[];

	correct.log("В кэше нод: "+cacheNodesCount+" общей длиной "+cacheLength+", минимум метрики "+currentMin);

	storageWrapper.setKey("chas-correct-typical-nodes",typicalNodes);
}


//Объединение текста всех нод и выкидывание ненужных регулярок

var text="";
function selectRegs(i,len){
//	var textArr=[];
//	megaexpressionParts=[];
	text="";
	var megaexpressionSource="(";
	var delimiter=")|(";
	var t=new Date().getTime();
	for(;i<len;i++){
		if(!(textNodes[i].data in typicalNodes.nodes))
//			textArr.push(textNodes[i].data);
			text+=" "+textNodes[i].data;
	}
	actionArray=actionArrayCopy.slice();//Да, так быстрее: http://jsperf.com/array-slice-vs-push
//	var text=textArr.join(" ");
//	correct.log(text);

//{{Экспериментальное выкидывание регэкспов парами - медленнее
/*	var l=actionArray.length;
	for(var j=1; j<l; j+=2){
		if(
			actionArray[j] && actionArray[j][3] &&
			actionArray[j-1] && actionArray[j-1][3]
		){
			if(!(
					new RegExp(
						"("+
							actionArray[j][3]+")|("+
							actionArray[j-1][3]+
						")"
					)
				).test(text))
			{
				actionArray.spliceWithLast(j);
				actionArray.spliceWithLast(j-1);
				l-=2;
				j-=2;
			}
		}
	}
	console.log(l);
*/
//}}
	var l=actionArray.length;

	for(var j=0; j<l; j++){
		if(actionArray[j] && actionArray[j][2]){
			if(!actionArray[j][2].test(text)){
				actionArray.spliceWithLast(j);//Это быстрее, чем забивать нулями
				l--;
				j--;
			}else{
				megaexpressionParts.push(actionArray[j][2].source);
//				megaexpressionSource+=actionArray[j][3]+delimiter;
			}
		}
	}
//	megaexpression=new RegExp("("+megaexpressionParts.join(")|(")+")","im");
	megaexpression=new RegExp(megaexpressionSource.replace(/\)\|\($/,"")+")","im");
//	correct.log(megaexpression);
	correct.logTimestamp("Выбор регэкспов", t);
}

//Сбросить кэш
function clearNodeCache(){
	storageWrapper.setKey("chas-correct-typical-nodes",{totalPages:0,nodes:{}});
}

//Расстановка типографики + откладывание автокоррекции при наборе
document.onkeydown = keydownHandler;

function keydownHandler(e) {
	keydownLastTime=new Date().getTime();
    e = e || event;
	if ((e.ctrlKey && e.shiftKey && e.keyCode == "A".charCodeAt(0))) {
        forceTypo();
        return false;
    }
}

function forceTypo(){
	extractAllTextNodes();
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
