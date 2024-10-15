function sign(x){
	if(x>0)return 1
	if(x<0)return -1
	return 0
}
function lsign(x){
	if(sign(x) == 0) return '';
	if(sign(x) == 1) return '+';
	return '-';
}

function latex_term(coef,degree,variable="x",leading=false){
	if(coef == 0 && !leading) return '';
	if(coef == 0 && leading) return '0';
	let result = ``;
	
	if(degree == 0){
		if(leading) return `${coef}`;
		else return `${lsign(coef)}${Math.abs(coef)}`;
	} 
	
	if(Math.abs(coef) != 1) result = `${Math.abs(coef)}`;
	let s = sign(coef);
	if(leading && s==-1) result = `-${result}`;
	if(!leading) result = `${lsign(coef)}${result}`;
	
	
	result += `${variable}`;
	if(degree>1) result+=`^{${degree}}`;
	return result;
}

class polynomial{
	//coefficients = [c0, c1, c2, c3]
	//f(x) = c0 + c1x^1 +... +cnx^n
	constructor(coefficients){
		this.coefficients = coefficients;
		this.variable = "x";
	}
	
	get degree(){
		return this.coefficients.length-1;
	}

	get length(){
		return this.coefficients.length;
	}
	
	get last(){
		return this.coefficients[this.degree];
	}

	copy(){
		return new polynomial(Array.clone(this.coefficients));
	}

	reduce (){
		while(this.last == 0 && this.degree>0)
			this.coefficients.pop();
	}

	toString(){
		this.reduce();
		let result = '';
		for(let i = this.degree;i>=0;i--){
			result += latex_term(this.coefficients[i],i,this.variable,i==this.degree);
		}
		return result;
	}

	add(other){
		let result;
		if(instanceOf(other,polynomial)){
			
			if(this.length>other.length){
				result = this.copy();
			}else{
				result = other.copy();
			}
			let n = Math.max(this.length,other.length)
			for(let i = 0;i<n-1;i++){
				result.coefficients[i] = this.coefficients[i]+other.coefficients[i];
			}

		}
		else if(instanceOf(other,Number)){
			result = this.copy();
			for(let i = 0;i<this.length-1;i++){
				result.coefficients[i]+=other;
			}
		}else if(instanceOf(other,Array)){
			result = new polynomial(other);
			result = this.add(result);
		}else{
			throw new Error("Cannot add polynomial to this type of object!")
		}
		return result;
	}

	mul(other){
		let result;
		if(instanceOf(other,polynomial)){
			result = new polynomial([0]);
			let coefficients = Array.clone(other.coefficients);

			for(let i = 0;i<this.length;i++){
				let temp = new polynomial(coefficients);
				result= result.add(temp.mul(this.coefficients[i]));			
				coefficients.unshift(0);
			}
			
		}
		else if(instanceOf(other,Number)){
			result = this.copy();
			for(let i = 0;i<this.length;i++){
				result.coefficients[i]*=other;
			}
		}else if(instanceOf(other,Array)){
			result = new polynomial(other);
			result = this.mul(result);
		}else{
			throw new Error("Cannot multiply polynomial to this type of object!")
		}
		return result;
	}

	sub(other){
		if(instanceOf(other,Number)){
			other=new polynomial([other]);
		}else if(instanceOf(other, Array)){
			other=new polynomial(other);
		}
		return this.add(other.mul(-1));
	}

	eval(x){
		let result = 0;
		for(var i = this.degree; i>=0;i--){
			result += this.coefficients[i]*Math.pow(x,i);
		}
		return result;
	}
}

export {polynomial}