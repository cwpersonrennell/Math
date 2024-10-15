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

function updateFields(database){
	let name = loadEl.value;
	console.log(name);
	console.log(database);

	let data = database[name];
	nameEl.value = data.name;
	codeEl.value = data.code;
	varsEl.value = data.vars.join(", ");
	bodyEl.value = data.body;

	jsonEl.innerHTML = "";
	previewEl.innerHTML = "";	

}

function loadLocalStorageList(loadEl){
	loadEl.innerHTML = "";
	let keys = Object.keys(localStorage);
	let results = [];
	let database = {};
	for(let i = 0;i<keys.length;i++){
		if(keys[i].search(location.href)>=0){
			results.push(JSON.parse(localStorage[keys[i]]));
		}
	}
	
	for(let i=0;i<results.length;i++){
		let el = document.createElement("option");
		el.innerText = results[i].name;
		el.value = results[i].name;
		database[name] = results[i];
		loadEl.appendChild(el);
	}
	console.log(`Database should be: `);
	console.log(database);
	updateFields(database);
	return database;
}

var database = loadLocalStorageList(loadEl);

loadEl.addEventListener("change",()=>{
	updateFields(database);
});

saveEl.addEventListener("click",()=>{
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
		database = loadLocalStorageList();
	}catch(err){console.log(err);}

});



