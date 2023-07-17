import  Pocketbase from './pb.js'
 
const pb = new Pocketbase('https://postr.pockethost.io')
pb.autoCancellation(false)
window.pb = pb

if(!pb.authStore.isValid){
    localStorage.removeItem('pocketbase_auth')
}