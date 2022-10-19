function renderPage(){
  MathJax.typeset();
  getCalculators();
}
      
function loadHTML(href,target){
  fetch(href).then( response=>{return response.text();}).then(content=>{
    let shell = document.createElement('div');
    shell.innerHTML=content;
    target.appendChild(shell);
    renderPage();
  });
}
