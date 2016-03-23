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

try{
	var dict=require('./dictionary.js');
	for(var chto in dict)
		global[chto]=dict[chto];
}catch(e){
	//Значит, не node.js
}

var wordSplitSymbol="([^А-Яа-яЁёA-Za-z\u00AD]|^|$)"; // 0xAD - "мягкий перенос"
//var wordSplitSymbolSafe="(?=[^А-Яа-яЁёA-Za-z]|^|$)";
var leftEnd="(.|^)";//TODO: переписать так, чтобы стал не нужен
//var rightEnd="(.|$)";
//var rightEndSafe="(?=.|[\\s\\S]|$)";
var actionArray=[
	[/[ь]{2,}/g,"ь",/ьь/i],
	[/[ъ]{2,}/g,"ъ",/ъъ/i],

	[/([ЖжШшЩщ])[ыЫ]/g,"$1и",/[жшщ]ы/i],
	[/([ЧчЩщ])[яЯ]/g,"$1а",/[чщ]я/i],
	[/([ЧчЩщ])[юЮ]/g,"$1у",/[чщ]ю/i],
	[/([^А-Яа-яЁёA-Za-z]|^)з(?=[бжкстф-щБЖКПСТФ-Щ]|д(?!ани|ань|ес|еш|оров|рав|рас))/g,"$1с",/([^А-Яа-яЁёA-Za-z]|^)з(?=[бджкпстф-щБДЖКПСТФ-Щ])/],
	[/([^А-Яа-яЁёA-Za-z]|^)З(?=[бжкстф-щБЖКПСТФ-Щ]|д(?!ани|ань|ес|еш|оров|рав|рас))/g,"$1С",/([^А-Яа-яЁёA-Za-z]|^)З(?=[бджкпстф-щБДЖКПСТФ-Щ])/],
];


var qmInReg=/\(\?[\=\!]/;

function prepareExpression(word, str, prefix, postfix){
	if(word[0] !== str[0])
		return prepareReplaceHeavy(word, str, prefix, postfix);
	var firstLetter=word[0];
	var lostWord=word.substr(1);
//	var safe=qmInReg.test(word)
//	var wordSplitSymbolHere=(postfix && safe) ? wordSplitSymbolSafe : wordSplitSymbol;
//	if(postfix && qmInReg.test(word))
//		correct.log(word+rightEndHere);

	var pattern =
		(prefix ? wordSplitSymbol : leftEnd ) +
		"(["+firstLetter.toLowerCase()+firstLetter.toUpperCase()+"])"+lostWord+
		(postfix ? wordSplitSymbol : "");
	var regexp=new RegExp(pattern,"gm");
//	correct.log(regexp);
	actionArray.push([regexp,"$1$2"+str.substr(1)+(postfix?"$3":""),new RegExp(word,"i"),word]);
//	megaexpressionParts.push(pattern);
}

function prepareReplaceHeavy(reg, str, prefix, postfix){
	var lostreg=reg.substr(1);
	var loststr=str.substr(1);
	var pattern1 =
		(prefix ? wordSplitSymbol : leftEnd ) +
		reg[0].toLowerCase()+lostreg+
		(postfix ? wordSplitSymbol : "" );
	var regexp1=new RegExp(pattern1,"gm");
	var pattern2 =
		(prefix ? wordSplitSymbol : leftEnd ) +
		reg[0].toUpperCase()+lostreg+
		(postfix ? wordSplitSymbol : "" );
	var regexp2=new RegExp(pattern2,"gm");
	actionArray.push([regexp1,"$1"+str[0].toLowerCase()+loststr+(postfix ? "$2" : ""),new RegExp(reg,"i"),str]);
	actionArray.push([regexp2,"$1"+str[0].toUpperCase()+loststr+(postfix ? "$2" : ""),new RegExp(reg,"i"),str]);
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
		}

var actionArrayCopy=actionArray.slice();

var correct={
	logArray:[],
	log: function(param){
		this.logArray.push(param);
	},
	logToConsole: function(){
		console.log("chas-correct: "+this.logArray.join("\n\r"));
		this.logArray=[];
	},
	replacedPairs:[],
	logReplaced: function(){
		var rez="";
		var len=this.replacedPairs.length;
		for(var i=0; i<len;i+=2){
			if(this.replacedPairs[i]!=this.replacedPairs[i+1]){
				var slen=this.replacedPairs[i].length;
				for(var j=0; j<slen && this.replacedPairs[i][j]===this.replacedPairs[i+1][j]; j++){
				}
				rez+="\n\r\n\r"+this.replacedPairs[i]+"\n\r->\n\r"+this.replacedPairs[i+1].substr(j-10<0?0:j-10);
			}
		}
		this.replacedPairs=[];
		return rez;
	},
	logTimestamp: function(text, timestamp){
		correct.log(text+" (мс): "+(Date.now() - timestamp));
	},
};

//Теперь удаляем исходные словари - они больше не нужны, все слова уже обработаны, только память занимают
//TODO: делать это вообще при сборке. Когда она будет
orphoWordsToCorrect=orphoPrefixToCorrect=orphoPostfixToCorrect=orphoFragmentsToCorrect=globalArray=null;

try{
	module.exports.actionArray = actionArray;
}catch(e){
	//Значит, не node.js
	correct.log("chas-correct: на подготовку массива регулярных выражений затрачено (мс): "+(Date.now() - oldTime));
}
