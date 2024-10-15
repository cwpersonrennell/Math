import {polynomial} from "./modules/Polynomial.js";
import {sandbox} from "./modules/Sandbox.js";

var code=document.getElementById("code").value;
var vars=document.getElementById("vars").value.replaceAll(" ","").split(",");
var json = JSON.stringify({"vars":vars,"code":code});
let button = document.getElementById("go");
button.addEventListener("click",()=>{
	document.getElementById("content").innerText = json;	
});



