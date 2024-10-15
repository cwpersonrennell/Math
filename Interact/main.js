import {polynomial} from "./modules/Polynomial.js";

let p1 = new polynomial([1,1,-1]);

var _eval_context_ ={polynomial};

console.log(`${p1}`);
var x = 0;
eval("x++;");
console.log(x);
var f;

eval(`
	f = function(x){return x*x}
	`);
console.log(f(2));
var _vars_=['a', 'b', 'x', 'y'];
var __vars__ = '';
function initializeVars(){
	let result = `var _exports_ = {};\n`;
	for(let i =0;i<_vars_.length;i++){
		result+=`var ${_vars_[i]} = '';\n`;
		result+=`_exports_.${_vars_[i]}='';\n`;
	}
	return result;
}
function readyExport(){
	let result = `\n`;
	for(let i =0;i<_vars_.length;i++){
		result+=`_exports_.${_vars_[i]}=${_vars_[i]};\n`;
	}
	result+=`\n_exports_;\n`;
	return result;
}

function test(){
	let result = eval?.(
		`
		"use strict";
		${initializeVars()}
			a=2;
			b = 5;
			x = a*b;
			y = a/b;
		${readyExport()}
		`);
	return result;
}

var _exports_;
try{
	_exports_ = test();
}
catch(err){}

console.log(_exports_);