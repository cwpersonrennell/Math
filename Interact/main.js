import {polynomial} from "./modules/Polynomial.js";

function initializeVars(_vars_){
	let result = `var _exports_ = {};\n`;
	for(let i =0;i<_vars_.length;i++){
		result+=`var ${_vars_[i]} = '';\n`;
		result+=`_exports_.${_vars_[i]}='';\n`;
	}
	return result;
}
function readyExport(_vars_){
	let result = `\n`;
	for(let i =0;i<_vars_.length;i++){
		result+=`_exports_.${_vars_[i]}=${_vars_[i]};\n`;
	}
	result+=`\n_exports_;\n`;
	return result;
}

function sandbox(_vars_){
	let result = eval?.(
		`
		"use strict";
		${initializeVars(_vars_)}
			function f(x){
				return x*x;
			}
			a = f(2);
			b = 5;
			x = a*b;
			y = a/b;
		${readyExport(_vars_)}
		`);
	return result;
}

var _exports_;
try{
	_exports_ = test(['a','b','x','y']);
}
catch(err){console.log(err);}

console.log(_exports_);