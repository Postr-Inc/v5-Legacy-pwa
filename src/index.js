import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Router from './misc/router.js'
import Home from './pages/home';
import './styles/output.css'
import Pocketbase from 'pocketbase'
import { Profile } from './pages/profile';
import { Settings } from './pages/settings';
import { Download } from './pages/download';
import { Terms } from './pages/terms';
import { Privacy } from './pages/privacy';
import { Error } from './pages/error';
import { Search } from './pages/search';
 
export const api = new Pocketbase('https://postrapi.pockethost.io')
api.autoCancellation(false)
const root = ReactDOM.createRoot(document.getElementById('root'));
let app = new Router('/home')
app.use('/profile')
app.use('/home')
app.use('/settings')
app.use('/download')
app.use('/terms')
app.use('/privacy')
app.use('/search')
window.resizeTo(175, 812)
window.onresize = ()=>{
  if(window.matchMedia('(display-mode: standalone)').matches){
    window.innerWidth > 1000 ? document.body.style.zoom = 1.5 : document.body.style.zoom = 1
   window.innerHeight > 1000 ? document.body.style.zoom = 1.5 : document.body.style.zoom = 1
    window.resizeTo(275, 812)
  }
}
app.get('/home', (req, res)=>{
  if(!window.navigator.standalone || !window.matchMedia('(display-mode: standalone)').matches){
    window.location.hash = '#/download'
  }
  root.render(<Home />)
})
app.on('/home', (req, res)=>{
  if( !window.matchMedia('(display-mode: standalone)').matches){
    window.location.hash = '#/download'
  }
  console.log('home')
  root.render(<Home />)
})
app.on('/profile/:id', (req, res)=>{
  if(!window.matchMedia('(display-mode: standalone)').matches){
    window.location.hash = '#/download'
  }
  console.log('profile')
  root.render(<Profile user={req.params.id} />)
})
app.get('/profile/:id', (req, res)=>{
  if( !window.matchMedia('(display-mode: standalone)').matches){
    window.location.hash = '#/download'
  }
  document.getElementById('root').innerHTML = ''
  root.render(<Profile user={req.params.id} />)
})
app.on('/settings', (req, res)=>{
  root.render(<Settings />)
})
app.get('/settings', (req, res)=>{
  root.render(<Settings />)
})
app.on('/download', (req, res)=>{
  if( window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches){
    window.location.hash = '#/home'
  }
  root.render(<Download />)
})
app.get('/download', (req, res)=>{
  if(window.matchMedia('(display-mode: standalone)').matches){
    window.location.hash = '#/home'
  }
  root.render(<Download />)
})
app.on('/terms', (req, res)=>{
  root.render(<Terms />)
})
app.get('/terms', (req, res)=>{
  root.render(<Terms />)
})
app.on('/privacy', (req, res)=>{
  root.render(<Privacy />)
})
app.get('/privacy', (req, res)=>{
  root.render(<Privacy />)
})
app.on('/search', (req, res)=>{
  root.render(<Search />)
})
app.get('/search', (req, res)=>{
  root.render(<Search />)
})
app.handleErrors('404', (err)=>{
   root.render(<Error />)
})
 
app.start()


setInterval(()=>{
  if(window.matchMedia('(display-mode: standalone)').matches 
  &&
  window.location.hash === '#/download' &&
  window.location.hash !== '#/home'){
    window.location.hash = '#/home'
  }
}, 1000)

window.onbeforeunload = function() {
  sessionStorage.clear()
}
 
 
reportWebVitals();
