import {polynomial} from "./modules/Polynomial.js";
import {sandbox} from "./modules/Sandbox.js";

var button = document.getElementById("go");
var jsonEl = document.getElementById("json-content");
var previewEl = document.getElementById("preview");

button.addEventListener("click",()=>{
	let code=document.getElementById("code").value;
	let vars=document.getElementById("vars").value.replaceAll(" ","").split(",");
	let body=document.getElementById("body").value;
	let data = {"vars":vars,"code":code,"body":body};
	let json = JSON.stringify(data)
	jsonEl.value = json;

	let output = sandbox(vars,code);
	console.log(output);
	
});



