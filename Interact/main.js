import {polynomial} from "./modules/Polynomial.js";
import {sandbox} from "./modules/Sandbox.js";

var button = document.getElementById("go");
var jsonEl = document.getElementById("json-content");
var previewEl = document.getElementById("preview");

button.addEventListener("click",()=>{
	let name=document.getElementById("name").value;
	let code=document.getElementById("code").value;
	let vars=document.getElementById("vars").value.replaceAll(" ","").split(",");
	let body=document.getElementById("body").value;
	let data = {"name":name,"vars":vars,"code":code,"body":body};
	let json = JSON.stringify(data)
	jsonEl.value = json;

	let output = sandbox(vars,code);
	console.log(output);
	for(let i = 0;i<vars.length;i++){
		body = body.replaceAll(`{{${vars[i]}}}`,`${output[vars[i]]}`);
	}
	previewEl.innerHTML = body;
	try{
		MathJax.typeset();
	}catch(err){console.log(err);}

});



