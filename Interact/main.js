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

function test(){
	let result = eval?.(
		`
		"use strict";
		console.log(window);
		var a = 1;
		function parser(){
			let newVar = "hello World";
			let p1 = new polynomial([1,2,0,-1]);
		}
		console.log(parser);
		parser;
		`);
	console.log(parser);
	console.log(a);
	return result;
}
var _exports_;
try{
	_exports_ = test();
}
catch(err){}

console.log(_exports_);