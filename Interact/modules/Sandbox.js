//Requires MathJS installation (can't use ES6 Module at this time)
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
	
	for(let i=0;i<vars.length;i++){
		scope[vars[i]]=0;
	}

	let lines = code.split("\n");
	
	for(let i = 0;i<lines.length;i++){
		let line = lines[i];
		if(line.search("TEX")==0){
			try{
				line=line.replace("TEX","");
				let temp = line.split("=");
				temp[0]=temp[0].replaceAll(" ","");
				scope[temp[0]] = math.parse(temp[1]).toTex();
			}catch(err){console.log(err);}
		}else{
			try{
				math.evaluate(lines[i],scope); 
			}catch(err){
				console.log(err);
			}
		}
	}

	return scope;
}


export {create, evaluate}