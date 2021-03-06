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

////////////////////////////////////////////////////////////////////////
// ПРЕФИКСЫ
//
// Функции:
// string   - получает строку и возвращает строку
// cache    - работа с кэшем
//
// Переменные:
// reg      - регулярное выражение
// str      - строка
// flag     - флаг
// concated - "слепленные": текст и регулярки
//
// В блоке типографики пока префиксов нет
// TODO: сделать!
////////////////////////////////////////////////////////////////////////

Array.prototype.spliceWithLast=function(index){
	///Заменить элемент под номером index последним, последний удалить
	///Это, очевидно, эффективнее, чем сдвигать весь массив и даже чем просто заменять на null
	'use strict';
	this[index]=this[this.length-1];
	this.length--;
};

Array.prototype.replaceWith=function(index,replacerIndex){
	///Заменить элемент под номером index элементом под номером replacerIndex
	'use strict';
	this[index]=this[replacerIndex];
};

Object.defineProperty(Array.prototype, 'spliceWithLast', {enumerable: false});
Object.defineProperty(Array.prototype, 'replaceWith'   , {enumerable: false});


//Сейчас эта функция не используется, но, возможно, очень скоро пригодится для оптимизаций
var regNotCyrillicToTrim=/^[^а-яё]+|[^а-яё]+$/i;
function stringTrimNotCyrillic(ih) {
	//Да, быстрее так, а не методом-членом
	return ih.replace(regNotCyrillicToTrim,"");
	//TODO: проверить, быстрее одной регуляркой или двумя
}

//Кэшируем строки и регэкспы. Вроде как помогает.
var regUn1=/[(]{6,}/g		, strUn1="(((";
var regUn2=/[)]{6,}/g		, strUn2=")))";
var regUn3=/[!]1+/g			, strUn3="!";
var regUn4=/[?]7+/g			, strUn4="?";
var regUn5=/([.?!])\1{3,}/g	, strUn5="$1$1$1";
function stringReplaceUniversal(ih){
	return ih.
		replace(regUn1,strUn1).
		replace(regUn2,strUn2).
		replace(regUn3,strUn3).
		replace(regUn4,strUn4).
		replace(regUn5,strUn5);
}

var reg3podryad=/([А-Яа-яЁё])\1{3,}/g;
function stringSpecialWork(ih){
	return ih.replace(reg3podryad,"$1$1$1");//Это не выносится из-за сигнатуры
}

var totalNodes=0;
var errorNodes=0;

function stringMainWork(ih){
	ih=stringSpecialWork(ih);

	totalNodes++;

	if(!concatedRegexp.test(ih))
		return ih;

	errorNodes++;

	correct.replacedPairs.push(ih);
	for(var i=0; i<actionArray.length;i++){
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
	///Добавить все текстовые ноды-потомки rootNode в массив textNodes
	var walker = document.createTreeWalker(
		rootNode,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);

	var node;

	while(node = walker.nextNode()) {
		if(node.data!="" && node.data.trim()!=""){
			node.data=stringReplaceUniversal(node.data);
			if(!notContainsCyrillic(node.data)){
				textNodes.push(node);
			}
		}
	}
}

function extractAllTextNodes() {
	///Заменить textNodes на список
	var timeBeforeNodesExtracting=Date.now();
	textNodes=[];
	extractTextNodesFrom(document.body);
	correct.logTimestamp("На подготовку массива текстовых нод затрачено", timeBeforeNodesExtracting);
}

var firstChangingNode,lastChangingNode;
var timeBeforeMain;

function selectNodes() {
	firstChangingNode = 0;
	lastChangingNode  = textNodes.length-1;

	var timeBeforeHeader=Date.now();
	if(typicalNodes.nodes){
		//Пропускаем "шапку" страницы
		while(
				firstChangingNode <= lastChangingNode
			&&
				cacheIncreaseIfExists(textNodes[firstChangingNode].data)
		){
			firstChangingNode++;
		};
		//И низушку
		while(
				firstChangingNode <= lastChangingNode
			&&
				cacheIncreaseIfExists(textNodes[lastChangingNode].data )
		){
			lastChangingNode--;
		};
	}

	var cachedNodes=firstChangingNode+textNodes.length-lastChangingNode-1; //TODO: проверить, в какую там сторону единичка
	correct.log("Нод отнесено к шапке: "+cachedNodes+"("+(cachedNodes/textNodes.length*100)+"%), до "+firstChangingNode+"-й и после "+lastChangingNode+"-й");
	correct.logTimestamp("Выделение шаблона", timeBeforeHeader);

	var timeBeforeNotCachedNodesSelecting=Date.now();

	concatedText="";

	// Теперь выкидываем ноды, которые в кэше
	for(var i=firstChangingNode; i<=lastChangingNode; i++){
		if(cacheIncreaseIfExists(textNodes[i].data)){ // Наша нода уже закэширована
			// Заменяем её на ту, которая должна быть последней
			textNodes[i] = textNodes[lastChangingNode];
			lastChangingNode--;
			//И потом снова изучаем полученное
			i--;
		} else {
			concatedText+=" "+textNodes[i].data;
		}
	}

	//Да, так быстрее, чем обрезать каждую по отдельности.
	//Это вообще парадокс: практически всегда быстрее работать с одной большой строкой, а не с несколькими маленькими
	concatedText=concatedText.replace(/[^а-яё]{4,}/gi," ");

	// TODO: вынести это в selectNodes
	if(concatedText.trim()==""){
		correct.log("Все ноды в кэше - нечего делать");
		clearTemporaryData();
		return 0;
	}
	correct.logTimestamp("Выбор незакэшированных нод", timeBeforeNotCachedNodesSelecting);
	return 1;
}


function fixMistakes() {

	if(!selectNodes()){ // Все ноды закешированы
		return 0;
	}
	if(!selectRegs()){ // Нет регулярок, с которыми нужно работать
		return 0;
	}

	timeBeforeMain=Date.now();

	asyncFixLoop();
	flagEchoMessageDomChanged=1;
}

function firstRun() {
	extractAllTextNodes();
	fixMistakes();
	typicalNodes.totalPages++;//Логично, считаем настоящее количество страниц
	setTimeout(cacheRemoveOutdated,4000);//TODO: кэширование вообще растащить
	observeDOM(document.body, domChangedHandler);//Ставим обработчик изменений DOM
}

//Объединение текста всех нод и выкидывание ненужных регулярок
var concatedText="";
var concatedRegexp;

function selectRegs(){
	var concatedRegexpSource="";
	var delimiter="|";
	var t=Date.now();

	actionArray=actionArrayCopy.slice();//Да, так быстрее: https://jsperf.com/array-slice-vs-push/3

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
				).test(concatedText))
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

	//TODO: аналогичный цикл, но идти с конца. А потом уже так. Как в selectNodes
	for(var j=0; j<l; j++){
		if(actionArray[j] && actionArray[j][2]){
			if(!actionArray[j][2].test(concatedText)){
				actionArray.replaceWith(j,l-1);//Это быстрее, чем забивать нулями
				l--;
				j--;
			}else{
				concatedRegexpSource+=actionArray[j][2].source+delimiter;
			}
		}
	}
	actionArray.length=l+1;

	concatedRegexpSource=concatedRegexpSource.replace(/\|$/,"")
	if(!concatedRegexpSource){
		correct.log("Нет обнаруживаемых ошибок");
		clearTemporaryData();
		correct.logTimestamp("Выбор регэкспов", t);
		return 0;
	}
	concatedRegexp=new RegExp(concatedRegexpSource,"im");
	correct.logTimestamp("Выбор регэкспов", t);
	return 1;
}


var asyncFixLoopStartTime;
var asyncCount=0;
function asyncFixLoop(){
	asyncCount++;
	asyncFixLoopStartTime=Date.now();
	flagEchoMessageDomChanged=1;
	for(;firstChangingNode<=lastChangingNode;firstChangingNode++){
	/*	var textArr=[];
		if(i%kuch == 0){
			for(var j=0; (i+j<len) && (j<kuch); j++){
				textArr.push(textNodes[i+j].data);
			}
			if(!concatedRegexp.test(textArr.join(" "))){
				i+=kuch;
				continue;
			}
		}
	*/	
		var currentNode=textNodes[firstChangingNode];
		if(!currentNode)//Не знаю, что имеется в виду
			continue;
		if(!cacheIncreaseIfExists(currentNode.data)){
			currentNode.data = stringMainWork(currentNode.data);
			typicalNodes.nodes[currentNode.data] = 20;
		}

/*		if(
		(firstChangingNode % 100 == 0)
			// || (Date.now() - asyncFixLoopStartTime > 146)
		){
			firstChangingNode++;
			setTimeout(asyncFixLoop,10);
			return;
		}
*/
	}
	correct.logTimestamp("Основной цикл", timeBeforeMain);
	actionsAfterFixLoop();
}

function actionsAfterFixLoop(){

	//Нечего память кушать! Надо будет - новые нагенерятся
	clearTemporaryData();

	//Кэш не резиновый
	setTimeout(cacheCrop,3000);

	correct.logTimestamp("chas-correct отработал. С момента запуска", oldTime);
	correct.logToConsole();
}

function clearTemporaryData(){
	///Очищаем временные переменные, чтобы не кушали память в простое
	textNodes = [];
	actionArray = [];
	concatedText = "";
	concatedRegexp = new RegExp("");
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Блок работы с кэшем типичных нод
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var typicalNodes;
var lastActionArrayLength=storageWrapper.getKey("lastActionArrayLength",0);
if(lastActionArrayLength==actionArrayCopy.length){
	typicalNodes=storageWrapper.getKey("chas-correct-typical-nodes",{totalPages:0,nodes:{}});
}else{
	typicalNodes={totalPages:0,nodes:{}};
	storageWrapper.setKey("lastActionArrayLength",actionArrayCopy.length);
	correct.log("Длина словаря изменилась - сбрасываем кэш");
}

function cacheMetrika(text) {
	return Math.pow(typicalNodes.nodes[text],2)/( typicalNodes.nodes[text].length + 6);
}

function cacheIncreaseIfExists(text){
	if(text in typicalNodes.nodes){
		typicalNodes.nodes[text]+=20;
		return 1;
	}
	return 0;
}


function cacheCrop() {
	///Удаление из кэша лишних (по некоторой метрике) нод
	//Считаем количество нод в кэше
	var cacheNodesCount=Object.keys(typicalNodes.nodes).length;
	var timeBefore=Date.now();

	var cacheLength=JSON.stringify(typicalNodes.nodes).length;
	var currentMin;
	var deletedNodes=0;
	var deletedNodesLength=0;
	var lastNode;

	while(
		//Ограничиваем кэш 100 килобайтами на сайт (или 200, т. к. юникод? Не важно)
		cacheLength > 102400
	||
		//Не более 1024 нод
		cacheNodesCount > 1024
	){
		for(var text in typicalNodes.nodes){
			break;
		}
		//Да, это так мы получаем первую ноду из кэша
		//Считаем её минимальной
		currentMin = cacheMetrika(text);
		//Ищем ноду с минимальным отношением квадрата повторяемости к длине
		for(var text2 in typicalNodes.nodes){
			var otherMetrika = cacheMetrika(text2);
			if( otherMetrika < currentMin ){
				text = text2;
				currentMin = otherMetrika;
			}
		}
		//Удаляем одну ноду
		deletedNodes++;
		deletedNodesLength+=text.length;
		delete typicalNodes.nodes[text];

		//Пересчитываем показатели
		cacheNodesCount--;
		cacheLength -= text.length+6;

		//Эталонной нодой снова становится последняя
		text = lastNode;
		//TODO: метрики тоже куда-то кэшировать
	}
	storageWrapper.setKey("chas-correct-typical-nodes",typicalNodes);
	correct.logTimestamp("Редукция кэша (нод: "+deletedNodes+", сумма длин удалённых нод: "+deletedNodesLength+")",timeBefore);
	correct.log("В кэше нод: "+cacheNodesCount+" общей длиной "+cacheLength+", минимум метрики "+currentMin);
}

function cacheRemoveOutdated() {
	for(var text in typicalNodes.nodes){
		typicalNodes.nodes[text]--;
		if(typicalNodes.nodes[text] < 0){
			delete typicalNodes.nodes[text];
		}
	}
}

//Сбросить кэш
function cacheClear(){
	storageWrapper.setKey("chas-correct-typical-nodes",{totalPages:0,nodes:{}});
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Блок обработки событий: нажатия клавиш (ввода текста) и изменения DOM
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var domChangedLastTime=Date.now();
var keydownLastTime=Date.now();
var domChangeTimes=0; // Сколько раз менялся DOM? Служит только для логов
var flagEchoMessageDomChanged=0;
var domChangingTimeout=0; //Тут хранится идентификатор запланированного изменения DOM

var observeDOM = (function(){
	///Наблюдение за DOM и вызов корректора при добавлении новых нод
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
		eventListenerSupported = window.addEventListener;

	return function(obj, callback){
		if( MutationObserver ){
			// define a new observer
			var obs = new MutationObserver(function(mutations, observer){
				var shouldBeHandled=0;
				var len=mutations.length;
				for(var i=0; i<len; i++){
					for(var j=0; j<mutations[i].addedNodes.length; j++){
						extractTextNodesFrom(mutations[i].addedNodes[j]);
					}
					//Гоняем проверялку только по тем нодам, которые добавились
					//Сложность в том, что добавиться могло целое дерево
					shouldBeHandled+=mutations[i].addedNodes.length;
				}
				if(shouldBeHandled){
					domChangedHandler();
				}else{
					correct.log("Изменение DOM, не добавляющее ноды");
				}
			});
			obs.observe( obj, { childList:true, subtree:true });
		}
		else if( eventListenerSupported ){
			obj.addEventListener('DOMNodeInserted', domChangedHandler, false);
		}
	}
})();

function scheduleDomChangeHandler(time){
	clearTimeout(domChangingTimeout);
	domChangingTimeout=setTimeout(domChangedHandler,time);
}

function domChangedHandler(){
	var thisTime=Date.now();

	// Если поднят флаг эхо-события (то есть мы сами только что поменяли DOM, внеся исправления),
	// то флаг опустить и ничего не делать.
	if( flagEchoMessageDomChanged ){
		flagEchoMessageDomChanged = 0;
		return;
	}

	if( thisTime < keydownLastTime + 2*1468 ){
		// Ещё идёт набор текста пользователем - последний раз клавиша нажата менее 3 секунд назад.
		// Если сейчас начать исправлять текст, есть риск помешать набору, что нехорошо.
		// Да, был такой баг.
		scheduleDomChangeHandler(keydownLastTime + 2 * 1468);
		return;
	}

	if(thisTime - domChangedLastTime < 1468 ){
		// Если недавно мы уже обрабатывали изменения DOM, то лучше дальнейшую обработку слегка отложить.
		// Возможно, следом прилетят ещё события. А то повиснем!
		scheduleDomChangeHandler(1468);
		return;
	}

	// Теперь ничто не мешает взять список добавленных или изменённых нод и провести в нём исправления

	domChangedLastTime=Date.now();
	fixMistakes();
	domChangeTimes++;
	correct.logTimestamp("Вызов chas-correct по смене DOM "+domChangeTimes+"-й раз", thisTime);
	correct.logToConsole();
}

//Расстановка типографики + откладывание автокоррекции при наборе + коррекция раскладки собеседника
document.addEventListener("keydown", keydownHandler, true);
//document.onkeydown = keydownHandler;

function keydownHandler(e) {
	keydownLastTime=Date.now();
    e = e || event;
	if (e.ctrlKey && e.shiftKey && e.keyCode == "A".charCodeAt(0)) {
        forceTypo();
        return false;
    } if (e.ctrlKey && e.shiftKey && e.keyCode == 109) {
        handleLayoutFix(regLayoutArrayCyr);
        return false;
    } if (e.ctrlKey && e.shiftKey && e.keyCode == 107) {
        handleLayoutFix(regLayoutArrayLat);
        return false;
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Блок, который отвечает только за типографические красоты - пробелы вокруг запятых и прочее.
// Так как он вызывается по требованию пользователя, оптимизация не критична (хотя никогда не лишняя).
//////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////
// По просьбам трудящихся - принудтранслит по Ctrl+Shift+?
////////////////////////////////////////////////////////////////////////

var strCyr="ёйцукенгшщзхъфывапролджэячсмитьбю"+'.Ё"№;:?ЙЦУКЕНГШЩЗХЪ/ФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,';
var strLat="`qwertyuiop[]asdfghjkl;'zxcvbnm,."+'/~@#$^&QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?';
var regLayoutArrayCyr=[], regLayoutArrayLat=[];
var cyrArray=strCyr.split("");
var latArray=strLat.split("");


for(var i=0; i<cyrArray.length; i++){
	regLayoutArrayCyr.push([cyrArray[i],latArray[i]]);
	regLayoutArrayLat.push([latArray[i],cyrArray[i]]);
}

function stringFixLayout(ih,arr){
	var rez="";
	for(var i=0; i<ih.length; i++){
		var letter=ih.substr(i,1);
		for(var j=0; j<arr.length; j++)
			letter=letter.replace(arr[j][0],arr[j][1]);
		rez+=letter;
	}
	return rez;
}

function handleLayoutFix(arr){
	var selectedText = window.getSelection().toString();
	alert(stringFixLayout(selectedText,arr));
}



////////////////////////////////////////////////////////////////////////
// Наконец, запускаем впервые коррекцию
// В самом конце, когда все функции уже определены
// На всякий случай
////////////////////////////////////////////////////////////////////////

firstRun();
