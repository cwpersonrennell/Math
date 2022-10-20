let MJ;
function renderPage(){
  //console.log(`Rendering Page with MathJax Version ${MJ.version}`);
  MJ.typeset();
  getCalculators();
}
      
function loadHTML(href,target,container='div'){
  promise = fetch(href).then( response=>{return response.text();}).then(content=>{
    let shell = document.createElement(container);
    shell.innerHTML=content;
    target.appendChild(shell);
  });
  return promise
}
const HTML_ROOT = "https://cwpersonrennell.github.io/Math/";

function loadFiles(files,target,container='div'){
  MJ = MathJax;
  let promises = [];
  for(let i = 0;i<files.length;i++){
    let promise=loadHTML(`${HTML_ROOT}${files[i]}.html`,target,container);
    promises.push(promise);
  }
  Promise.all(promises).then(()=>{
    //console.log("All elements fetched and embedded, rendering page");
    renderPage();
  });
}
