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
const HTML_ROOT = "https://cwpersonrennell.github.io/Math/";

function loadFiles(files,target){
  for(let i = 0;i<files.length;i++){
    loadHTML(files[i],target);
  }
}
