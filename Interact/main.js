import {polynomial} from "./modules/Polynomial.js";

let p1 = new polynomial([1,1,-1]);

console.log(`${p1}`);
var x = 0;
eval("x++;");
console.log(x);
var f;

eval(`
	f = function(x){return x*x}
	`);
console.log(f(2));


eval('var newVar = "hello World";');


console.log(newVar);