import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Router from './misc/router.js'
import Home from './pages/home';
import './styles/output.css'
import Pocketbase from 'pocketbase'
import { Profile } from './pages/profile';
import { Settings } from './pages/settings';
export const api = new Pocketbase('https://postr.pockethost.io')
api.autoCancellation(false)
const root = ReactDOM.createRoot(document.getElementById('root'));
let app = new Router('/home')
app.use('/profile')
app.use('/home')
app.use('/settings')
app.get('/home', (req, res)=>{
  root.render(<Home />)
})
app.on('/home', (req, res)=>{
  console.log('home')
  root.render(<Home />)
})
app.on('/profile/:id', (req, res)=>{
  console.log('profile')
  root.render(<Profile user={req.params.id} />)
})
app.get('/profile/:id', (req, res)=>{
  document.getElementById('root').innerHTML = ''
  root.render(<Profile user={req.params.id} />)
})
app.on('/settings', (req, res)=>{
  root.render(<Settings />)
})
app.get('/settings', (req, res)=>{
  root.render(<Settings />)
})
app.start()

 
 
reportWebVitals();
