import {polynomial} from "./Polynomial.js";

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

function sandbox(_vars_,code){
	if(_vars_.length == 0 || code.length == 0) return {};
	let result = eval?.(
		`
		"use strict";
		${initializeVars(_vars_)}
		${code}
		${readyExport(_vars_)}
		`);
	return result;
}

// var _exports_;
// try{
// 	_exports_ = sandbox(data["vars"],data["code"]);
// }
// catch(err){console.log(err);}

export {sandbox}