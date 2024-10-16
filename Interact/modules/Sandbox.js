//Requires MathJS installation (can't use ES6 Module at this time)
function create(imports = {},randomSeed = null){
	let config = {
		randomSeed:randomSeed,
	}
	let mathjs = math.create(all,config);
	mathjs.import(imports);
	return mathjs;
}

function evaluate(math,vars,code){
	let scope = {};
	
	for(let i=0;i<vars.length;i++){
		scope[vars[i]]=0;
	}

	let lines = code.split("\n");
	
	for(let i = 0;i<lines.length;i++){
		math.evaluate(lines[i],scope);
	}

	return scope;
}


export {create, evaluate}