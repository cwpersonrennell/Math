function renderPage(){
  MathJax.typeset();
  getCalculators();
}
      
function loadHTML(href,target,container='div'){
  fetch(href).then( response=>{return response.text();}).then(content=>{
    let shell = document.createElement(container);
    shell.innerHTML=content;
    target.appendChild(shell);
    renderPage();
  });
}
const HTML_ROOT = "https://cwpersonrennell.github.io/Math/";

function loadFiles(files,target,container='div'){
  for(let i = 0;i<files.length;i++){
    loadHTML(`${HTML_ROOT}${files[i]}.html`,target,container);
  }
}
