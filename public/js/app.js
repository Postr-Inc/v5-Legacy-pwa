import  Pocketbase from './pb.js'
 
const pb = new Pocketbase('https://postrapi.pockethost.io')
pb.autoCancellation(false)
window.pb = pb

if(!pb.authStore.isValid){
    localStorage.removeItem('pocketbase_auth')
    window.location.href = '#/login'
}


 
function setScreen() {
  window.innerWidth > 1000 ? document.body.style.zoom = 1.5 : document.body.style.zoom = 1
  window.innerHeight > 1000 ? document.body.style.zoom = 1.5 : document.body.style.zoom = 1
  window.resizeTo(375, 812)

}

function handleResize() {
  // Reset the screen dimensions whenever the user resizes the window
  setScreen();
}



 function checkplat(){
  if (window.matchMedia('(display-mode: standalone)').matches) {
      if (window.screen.height > 1000) {
        window.addEventListener('resize', ()=>{
          console.log(window.innerWidth)
          handleResize()
        });
        setScreen(); // Call setScreen initially to set the dimensions
  
      }
     if(window.location.hash == '#/download'){
      window.location.href = '#/'; // Redirect the user to the home page
     }
    } else {
      // If the app is not running in standalone mode, redirect the user to the download page
      window.location.href = '#/download';
    }
 }
 checkplat()
 window.onhashchange = () => {
  checkplat()
 }

 window.addEventListener('resize', ()=>{
  console.log(window.innerWidth)
  handleResize()
 })
