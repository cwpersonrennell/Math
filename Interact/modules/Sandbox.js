//Requires MathJS installation (can't use ES6 Module at this time)
import {polynomial} from "./Polynomial.js";

function create(imports = {},randomSeed = null){
	let config = {
		randomSeed:randomSeed,
		matrix:'Array'
	}
	let mathjs = math.create(math.all,config);
	mathjs.import(imports);
	return mathjs;
}

function evaluate(math,vars,code){
	let scope = {};
	let parser = math.parser();

	for(let i=0;i<vars.length;i++){
		scope[vars[i]]=0;
	}

	let lines = code.split("\n");
	
	for(let i = 0;i<lines.length;i++){
		let line = lines[i];
		let macro = line.slice(0,3);
		let temp;
		try{
		switch(macro){
			case "TEX":
				line=line.replace("TEX","");
				temp = line.split("=");
				temp[0]=temp[0].replaceAll(" ","");
				scope[`${temp[0]}_tex`] = parser.parse(temp[1]).toTex();
				break;
			case "POL":
				line=line.replace("POL","");
				temp = line.split("=");
				temp[0] = temp[0].replaceAll(" ","");
				let a = parser.parse(temp[1]);
				a = a.toString();
				if(a.slice(-1)==";") a = a.slice(0,-1);
				console.log(a);
				a = new polynomial(JSON.parse(a));
				scope[`${temp[0]}_pol`] = a.toString();
				break;
			default:
				parser.evaluate(lines[i],scope);

		}
		}catch(err){console.log(err);}
	}

	return scope;
}


export {create, evaluate}