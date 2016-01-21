var actionArray = require('../prepareDictionary.js').actionArray;

var globalExpression,
	globalExpressionExt,
	globalExpressionLess;

var leftExt,rightExt;

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

function checkText(text,options){
	if(!globalExpressionLess.test(text)){
		return;
	}
	
	var possibleMistakes=text.match(globalExpressionExt);
	if(!possibleMistakes){
		return;
	}

	for(var i=0; i<possibleMistakes.length; i++){
		var signatures = possibleMistakes[i].match(globalExpression);
		var confirmedSignatures=[];
		
		for(var l=0; l<signatures.length; l++){
			var buf=signatures[l];
			for(var j=0; j<actionArray.length; j++){
				buf=buf.replace(actionArray[j][0],actionArray[j][1]);
			}
			if(normalize(buf) != normalize(signatures[l])){
				confirmedSignatures.push(signatures[l]);
			}
		}
		
		if(confirmedSignatures.length){
			process.send({
				type:       'mistake',
				text:       possibleMistakes[i],
				options:    options,
				signatures: confirmedSignatures,
			});
			errors += confirmedSignatures.length;
		}
	}	
}

process.on('message', function (m) {
	switch(m.type){
		case 'checktext':
			checkText(m.text,m.options);
		break;
		case 'init':
			initGlobalExpression(m.left,m.right)
		break;
		case 'finish':
			process.send({
				type: 'quantity',
				quantity: errors
			});
			process.exit();
		break;
	}
});
