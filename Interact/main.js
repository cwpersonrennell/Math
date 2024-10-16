import {polynomial} from "./modules/Polynomial.js";
import {create, evaluate} from "./modules/Sandbox.js";
import {getCalculators} from "./modules/DesmosAddon.js";

var loadEl = document.getElementById("load");
var saveEl = document.getElementById("save");
var deleteEl = document.getElementById("delete");
var jsonEl = document.getElementById("json-content");
var previewEl = document.getElementById("preview");
var nameEl = document.getElementById("name");
var codeEl = document.getElementById("code");
var varsEl = document.getElementById("vars");
var bodyEl =document.getElementById("body");
var linksEl= document.getElementById("links");

var currentValue = '';

document.addEventListener("DOMContentLoaded", () => {
	math = create();
});

function clearEls(){
	nameEl.value = '';
	codeEl.value = '';
	varsEl.value = '';
	bodyEl.value = '';
	jsonEl.innerHTML = "";	
	previewEl.innerHTML = "";	
}


function renderJSONandBody(){
	let name=nameEl.value;
	let code=codeEl.value;
	let vars=varsEl.value.replaceAll(" ","").split(",");
	let body=bodyEl.value;
	let links=linksEl.value.replaceAll(" ","").split(",");

	let data = {"name":name,"vars":vars,"code":code,"body":body,"links":links};
	let json = JSON.stringify(data)
	jsonEl.value = json;

	let output = evaluate(math,vars,code);

	for(let i = 0;i<vars.length;i++){
		body = body.replaceAll(`{{${vars[i]}}}`,`${output[vars[i]]}`);
	}
	previewEl.innerHTML = body;
	try{
		MathJax.typeset();
		getCalculators();
	}catch(err){console.log(err);}
	
}

function saveToLocalStorage(){
	let name=nameEl.value;
	currentValue = name;
	let code=codeEl.value;
	let vars=varsEl.value.replaceAll(" ","").split(",");
	let body=bodyEl.value;
	let links=linksEl.value.replaceAll(" ","").split(",");

	let data = {"name":name,"vars":vars,"code":code,"body":body,"links":links};
	let json = JSON.stringify(data)
	jsonEl.value = json;
	try{
		localStorage.setItem(`${location.href}:${name}`,json);
		database = loadLocalStorageList(loadEl);
	}catch(err){console.log(err);}
	renderJSONandBody();

}

function updateFields(database){
	let name = loadEl.value;
	clearEls();

	if(name == '') return;
	let data = database[name];

	try{
		nameEl.value = data.name;
		codeEl.value = data.code;
		varsEl.value = data.vars.join(", ");
		bodyEl.value = data.body;
		linksEl.value = data.links.join(", ");
	}catch(err){console.log(err);}

	renderJSONandBody();
}

function loadLocalStorageList(loadEl){
	if(loadEl.value) currentValue = loadEl.value;
	loadEl.innerHTML = "";

	let keys = Object.keys(localStorage);
	let results = [];
	let DB = {};
	for(let i = 0;i<keys.length;i++){
		if(keys[i].search(location.href)>=0){
			results.push(JSON.parse(localStorage.getItem(keys[i])));
		}
	}
	
	for(let i=0;i<results.length;i++){
		let el = document.createElement("option");
		
		el.innerText = results[i].name;
		el.value = results[i].name;
		DB[results[i].name] = results[i];
		loadEl.appendChild(el);
	}
	loadEl.value = currentValue;
	updateFields(DB);

	return DB;
} 

function deleteSelected(){
	localStorage.removeItem(`${location.href}:${loadEl.value}`);
	delete database[currentValue];
	loadEl.value = '';
	currentValue = '';
}

var database = loadLocalStorageList(loadEl);

loadEl.addEventListener("change",()=>{
	updateFields(database);
});

saveEl.addEventListener("click",()=>{
	saveToLocalStorage();
});

deleteEl.addEventListener("click",()=>{
	deleteSelected();
	loadLocalStorageList(loadEl);
});


