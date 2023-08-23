import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Router from './misc/router.js'
import Home from './pages/home';
import './styles/output.css'
import Pocketbase from 'pocketbase'
export const api = new Pocketbase('https://postr.pockethost.io')
api.autoCancellation(false)
const root = ReactDOM.createRoot(document.getElementById('root'));
let app = new Router('/')
app.get('/', (req, res)=>{
  root.render(<Home />)
})
app.on('/', (req, res)=>{
  root.render(<Home />)
})
app.start()
 
reportWebVitals();
