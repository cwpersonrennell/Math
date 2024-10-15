let red = "red";
let blue = "blue";
let black = "black";
let orange = "orange";
let purple = "purple";
let DEFAULT_OPTIONS = {expressions:false, lockViewport:true,fontSize:24};
  
function getCalculators(){
    
    let els = document.getElementsByTagName("calculator");
    let calculators =[];
    els = Array.from(els);
    for(let i =0;i<els.length;i++){
      let el = els[i];
      let calc_el = document.createElement("div");
      calc_el.style.width=el.style.width;
      calc_el.style.height=el.style.height;
      el.replaceWith(calc_el);
      if(el.getAttribute('data-string')!=undefined){
	      let options={};
	    if("options" in el.attributes){
	      options = JSON.parse(el.getAttribute("options"));
	    }

	    let calculator = Desmos.GraphingCalculator(calc_el,options);
	      
	    calculator.setState(JSON.parse(el.getAttribute('data-string')));
	      
	    if("mathbounds" in el.attributes){
	      calculator.setMathBounds(JSON.parse(el.getAttribute("mathbounds")));
	    }
	    calculators.push(calculator);
	      
	    continue;
	}
      let calculator_options ={};
      let math_bounds = {left:-10,bottom:-10,top:10,right:10};
      Object.assign(calculator_options,DEFAULT_OPTIONS);
	    
      if("options" in el.attributes){
           eval(`Object.assign(calculator_options,${el.attributes.options.value})`);
      }
      if("mathbounds" in el.attributes){
	    eval(`Object.assign(math_bounds,${el.attributes.mathbounds.value})`);
      }
      let content = el.innerHTML;
      let lines = content.split("\\ ");
      let expressions =[];
      for(line of lines){
    
        let latex = line.split(";")[0];        
        let options = {};
        eval(`Object.assign(options,${line.split(";")[1]})`);
        if(latex.replaceAll(/[\s\n]/g,"") != "table"){
          let expression ={latex:latex};
          Object.assign(expression,options);
          expressions.push(expression);
        }else{
           let columns = [];
          for(let k=1; k<line.split(";").length;k++){
            let obj = {};
            eval(`Object.assign(obj,${line.split(";")[k]})`);
            columns.push(obj);
          }
          expressions.push({type:"table",columns:columns});
        }
      }
      
      
      let calculator = Desmos.GraphingCalculator(calc_el,calculator_options);
      calculator.setMathBounds(math_bounds);
      calculator.setExpressions(expressions);
      calculators.push(calculator);
    }
    return calculators;
}
export {getCalculators}
