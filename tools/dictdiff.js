"use strict";

/*
usage:
	js tools/dictdiff.js hash1 hash2 
	js tools/dictdiff.js master origin/master 
*/

var exec = require('child_process').exec;
var vm = require('vm');

var rev1=process.argv[2],rev2=process.argv[3];
var buffer={};

var filesGot=0;
var targetObjectNames=[
	"orphoWordsToCorrect",
	"orphoPrefixToCorrect",
	"orphoPostfixToCorrect",
	"orphoFragmentsToCorrect",
];


function getFileFromGit(filename, revision, callback, callbackParam){
	exec('git show '+revision+':'+filename,
	{maxBuffer: 2048*1024},function(error, stdout, stderror) {
		callback({
			filename:filename,
			revision:revision,
			callbackParam:callbackParam,
			stdout:stdout,
			error:error,
			stderror:stderror,
			//Авось пригодится
		});
	});
}

function parseFileFromGit(o){
	var obj=vm.createContext();
	try{
		vm.runInContext(o.stdout, obj);
	}catch(e){
		console.log("Не удалось прочесть словарь в ревизии "+o.revision);
		console.log(o.stdout);
		return;
	}
	buffer[o.revision]={};
	for(var i=0; i<targetObjectNames.length; i++){
		buffer[o.revision][targetObjectNames[i]]=arrayToObject(obj[targetObjectNames[i]],0);
	}
	filesGot++;
	if(filesGot==2){
		parseResults();
	}
}

function parseResults(){
	for(var i=0;i<targetObjectNames.length;i++){
		var obj1=buffer[rev1][targetObjectNames[i]];
		var obj2=buffer[rev2][targetObjectNames[i]];
		removeCommonProperties(obj1,obj2);
	}
	removeEmptyProperties(buffer[rev1]);
	removeEmptyProperties(buffer[rev2]);
	membersToStringArrays(buffer[rev1]);
	membersToStringArrays(buffer[rev2]);
	console.log(buffer);
}

function arrayToObject(arr,value){
	var obj={};
	for(var i=0; i<arr.length; i++){
		obj[JSON.stringify(arr[i])]=value;
	}
	return obj;
}

function removeCommonProperties(obj1,obj2){
	for(var prop in obj1){
		if(prop in obj2){
			delete obj1[prop];
			delete obj2[prop];
		}
	}
}

function removeEmptyProperties(obj){
	for(var prop in obj){
		if(JSON.stringify(obj[prop])==="{}"){
			delete obj[prop];
		}
	}
}

function objectToStringArray(obj){
	var arr=[];
	for(var prop in obj){
		arr.push(prop);
	}
	return arr.sort();
}

function membersToStringArrays(obj){
	for(var memb in obj){
		obj[memb]=objectToStringArray(obj[memb]);
	}
}

getFileFromGit('chrome/dictionary.js',rev1,parseFileFromGit);
getFileFromGit('chrome/dictionary.js',rev2,parseFileFromGit);
