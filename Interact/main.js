import {polynomial} from "./modules/Polynomial.js";
import {sandbox} from "./modules/Sandbox.js";

var code=document.getElementById("code").value;
var vars=document.getElementById("vars").value.replaceAll(" ","").split(",");
let button = document.getElementById("go");

button.addEventListener("click",()=>{
	var data = {"vars":vars,"code":code};
	var json = JSON.stringify(data)
	console.log(code);
	console.log(vars);
	console.log(json);
	document.getElementById("content").innerText = json;	
});



