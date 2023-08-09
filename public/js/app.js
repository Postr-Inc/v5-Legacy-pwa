import  Pocketbase from './pb.js'
 
const pb = new Pocketbase('https://postr.pockethost.io')
pb.autoCancellation(false)
window.pb = pb

if(!pb.authStore.isValid){
    localStorage.removeItem('pocketbase_auth')
    window.location.href = '#/login'
}


 

window.onresize = (e) =>{
  window.innerHeight = "695"
  window.innerWidth = "500"
}
 window.innerHeight = "695"
 window.innerWidth = "500"
