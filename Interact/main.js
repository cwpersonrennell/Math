import {polynomial} from "./modules/Polynomial.js";
import {sandbox} from "./modules/Sandbox.js";

let button = document.getElementById("go");
button.addEventListener("click",()=>{
	let code=document.getElementById("code").value;
	let vars=document.getElementById("vars").value.replaceAll(" ","").split(",");
	let data = {"vars":vars,"code":code};
	let json = JSON.stringify(data)
	document.getElementById("content").innerText = json;	
});



