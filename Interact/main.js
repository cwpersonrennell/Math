import {polynomial} from "./modules/Polynomial.js";
import {sandbox} from "./modules/Sandbox.js";

var loadEl = document.getElementById("load");
var saveEl = document.getElementById("save");
var jsonEl = document.getElementById("json-content");
var previewEl = document.getElementById("preview");
var nameEl = document.getElementById("name");
var codeEl = document.getElementById("code");
var varsEl = document.getElementById("vars");
var bodyEl =document.getElementById("body");


function renderJSONandBody(){
	let name=nameEl.value;
	let code=codeEl.value;
	let vars=varsEl.value.replaceAll(" ","").split(",");
	let body=bodyEl.value;
	let data = {"name":name,"vars":vars,"code":code,"body":body};
	let json = JSON.stringify(data)
	jsonEl.value = json;
	
	let output = sandbox(vars,code);
	for(let i = 0;i<vars.length;i++){
		body = body.replaceAll(`{{${vars[i]}}}`,`${output[vars[i]]}`);
	}
	previewEl.innerHTML = body;
	try{
		MathJax.typeset();
	}catch(err){console.log(err);}
	
}

function saveToLocalStorage(){
	let name=nameEl.value;
	let code=codeEl.value;
	let vars=varsEl.value.replaceAll(" ","").split(",");
	let body=bodyEl.value;
	let data = {"name":name,"vars":vars,"code":code,"body":body};
	let json = JSON.stringify(data)
	jsonEl.value = json;
	try{
		localStorage[`${location.href}:${name}`]=json;
		database = loadLocalStorageList();
	}catch(err){console.log(err);}
	renderJSONandBody();

}

function updateFields(database){
	let name = loadEl.value;
	let data = database[name];
	nameEl.value = data.name;
	codeEl.value = data.code;
	varsEl.value = data.vars.join(", ");
	bodyEl.value = data.body;

	jsonEl.innerHTML = "";
	previewEl.innerHTML = "";	

	renderJSONandBody();
}

function loadLocalStorageList(loadEl){
	loadEl.innerHTML = "";
	let keys = Object.keys(localStorage);
	let results = [];
	let DB = {};
	for(let i = 0;i<keys.length;i++){
		if(keys[i].search(location.href)>=0){
			results.push(JSON.parse(localStorage[keys[i]]));
		}
	}
	
	for(let i=0;i<results.length;i++){
		let el = document.createElement("option");
		
		el.innerText = results[i].name;
		el.value = results[i].name;
		DB[results[i].name] = results[i];
		loadEl.appendChild(el);
	}
	updateFields(DB);
	return DB;
} 

var database = loadLocalStorageList(loadEl);

loadEl.addEventListener("change",()=>{
	updateFields(database);
});

saveEl.addEventListener("click",()=>{
	saveToLocalStorage();
});



