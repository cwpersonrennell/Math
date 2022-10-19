const target = document.getElementById("time");
let date = new Date();
function tick(){
  date = new Date();
  //console.log("tick");
  target.innerHTML=date.toLocaleTimeString();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
