var actionArray = require('../prepareDictionary.js').actionArray;

var globalExpression,
	globalExpressionExt,
	globalExpressionLess;

var leftExt,rightExt;
var timeElapsed=0;
function initGlobalExpression(left,right){

	left  || ( left = '');
	right || (right = '');
	leftExt = left;
	rightExt = right;
	var globalExpressionSrc = actionArray[0][0].source;
	var globalExpressionLessSrc = actionArray[0][2];
	for(var i=1; i<actionArray.length; i++){
		globalExpressionSrc     += "|" + actionArray[i][0].source;
		globalExpressionLessSrc += "|" + actionArray[i][3];
	}
	globalExpression     = new RegExp(globalExpressionSrc,"g");
	globalExpressionLess = new RegExp(globalExpressionLessSrc,"i");

	globalExpressionSrc = left+'('+globalExpressionSrc+')'+right;
	globalExpressionExt  = new RegExp(globalExpressionSrc,"g");
}

var errors=0;

function normalize(text){
	return text.replace(/ё/gi,"е").replace(/\s+/gi," ");
}

function makeCustomGlobalExpression(actionArrayCopy){
	var globalExpressionSrc = actionArrayCopy[0][0].source;
	for(var i=1; i<actionArrayCopy.length; i++){
		globalExpressionSrc += "|" + actionArrayCopy[i][0].source;
	}
	globalExpressionSrc = leftExt+'('+globalExpressionSrc+')'+rightExt;
	return new RegExp(globalExpressionSrc,"g");
}


function checkText(text,options){
	//{{Костыли
		text=text
			.replace(/[^а-яё]г-же[^а-яё]/gi,'')
			//.replace(/([а-яёА-ЯёA-Za-z][«"\s,\-:;]+)[А-ЯЁ][а-яё\-]+/g,'$1X ')//Дважды, а то отсекает через одно
			//.replace(/([а-яёА-ЯёA-Za-z][«"\s,\-:;]+)[А-ЯЁ][а-яё\-]+/g,'$1X ')
			.replace(/\s*(&nbsp;)+\s*/gi,' ')
			.replace(/[А-ЯЁ]*[іiїқѣєңәўғұњҙүөӡ][А-ЯЁ]*/i,' ')
			.replace(/<!--/i,' ') //TODO: strip HTML comments properly!
		;
	//}}Костыли


	if(!globalExpressionLess.test(text)){
		return;
	}

	var actionArrayCopy=[];
	for(var j=0; j<actionArray.length; j++){
		if(actionArray[j][0].test(text)){
			actionArrayCopy.push(actionArray[j]);
		}
	}
	if(!actionArrayCopy.length){
		return;
	}

	var globalExpressionCustom=makeCustomGlobalExpression(actionArrayCopy,text);

	var possibleMistakes=text.match(globalExpressionCustom);
	if(!possibleMistakes){
		return;
	}


	for(var i=0; i<possibleMistakes.length; i++){
		var signatures = possibleMistakes[i].match(globalExpression);
		var confirmedSignatures=[];
		var correctedInto=[];

		for(var l=0; l<signatures.length; l++){
			var buf=signatures[l];
			for(var j=0; j<actionArrayCopy.length; j++){
//				if(actionArray[j][0].test(signatures[l])){
					buf=buf.replace(actionArrayCopy[j][0],actionArrayCopy[j][1]);
//				}
			}
			if(normalize(buf) != normalize(signatures[l])){
				confirmedSignatures.push(signatures[l]);
				correctedInto.push(buf);
			}
		}

		if(confirmedSignatures.length){
			process.send({
				type:       'mistake',
				text:       possibleMistakes[i],
				options:    options,
				signatures: confirmedSignatures,
				correct:    correctedInto,
			});
			errors += confirmedSignatures.length;
		}
	}
}

process.on('message', function (m) {
	switch(m.type){
		case 'checktext':
			timeElapsed-=new Date().getTime();
				checkText(m.text,m.options);
			timeElapsed+=new Date().getTime();
		break;
		case 'init':
			initGlobalExpression(m.left,m.right);
		break;
		case 'finish':
			process.send({
				type: 'quantity',
				quantity: errors
			});
			console.log('Времени потрачено на проверку, мс: '+timeElapsed)
			process.exit();
		break;
	}
});
