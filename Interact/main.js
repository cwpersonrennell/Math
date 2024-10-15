import {polynomial} from "./modules/Polynomial.js";
import {sandbox} from "./modules/Sandbox.js";



function loadLocalStorageList(loadEl){
	let keys = Object.keys(localStorage);
	let results = [];
	let database = {};
	for(let i = 0;i<keys.length;i++){
		if(keys[i].search(location.href)>=0){
			results.push(JSON.parse(localStorage[keys[i]]));
		}
	}
	
	for(let i=0;i<results.length;i++){
		let el = document.createElement
		el.innerText = results[i].name;
		el.value = results[i].name;
		database[name] = results[i];
		loadEl.appendChild(el);
	}
	return database;
}
var loadEl = document.getElementById("load");
var database = loadLocalStorageList(loadEl);

loadEl.addEventListener("change",function(){
	let name = loadEl.value;
	console.log(name);
})

var save = document.getElementById("save");

var jsonEl = document.getElementById("json-content");
var previewEl = document.getElementById("preview");
var nameEl = document.getElementById("name");
var codeEl = document.getElementById("code");
var varsEl = document.getElementById("vars");
var bodyEl =document.getElementById("body");

save.addEventListener("click",()=>{
	let name=nameEl.value;
	let code=codeEl.value;
	let vars=varsEl.value.replaceAll(" ","").split(",");
	let body=bodyEl.value;
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
		localStorage[`${location.href}:${name}`]=json;
	}catch(err){console.log(err);}

});



