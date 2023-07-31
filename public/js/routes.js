import {googleclick,  signup, forgotPassword, verifyToken} from "./public/js/auth/auth.js"
import { loadProfile } from "./public/js/user/profile.js"
import { makePost } from "./public/js/user/createPosts.js"
import { loadFeed } from "./public/js/feed/feed.js"
import { viewPost } from "./public/js/post/showPost.js"
import { handleNotifications } from "./public/js/user/notifications.js"
const app = new Router()
// route defintions
app.use('/')
app.use('/signup')
app.use('/login')
app.use('/profile')
app.use('/post')
// binding root

app.bindRoot('app')
 
if(pb.authStore.isValid){
    try {
    pb.collection('users').authRefresh()
    handleNotifications()
 } catch (error) {
    window.location.href = '#/login'
 }
 
}

// check if running in a pwa or not'
function setScreen() {
    window.screen.orientation.lock('portrait')
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
  
app.get('/', (req, res) =>  {
 res.render('app')
 res.return()
 makePost()
 loadFeed()
 
})
 
app.on('/', (req, res) =>  {
    res.render('app')
    res.return()
    makePost()
    loadFeed()
    
      
})
app.root('/', (req, res) =>{
    res.render('app')
    res.return()
    makePost()
   
})
app.on('/download', (req, res) =>{
    res.render('download')
    res.return()
})
app.get('/download', (req, res) =>{
    res.render('download')
    res.return()
})
app.get('/signup', (req, res) =>  {
    res.return()
    res.render('signup')
    res.return()
    signup()
})
app.on('/signup', (req, res) =>  {
    res.return()
    res.render('signup')
    res.return()
    signup()
    
})
app.get('/login', (req, res) =>  {
    console.log(req)
    res.return()
    res.render('login')
    googleclick()
    res.return()
    
    
     
})
app.on('/login', (req, res) =>  {
    res.return()
    res.render('login')
    res.return()
    
   
  
})
 
app.on('/profile/:id', (req, res) =>  {
    res.render('profile')
    res.return()
    loadProfile(req.params.id)
    makePost()
     
     
})
app.get('/profile/:id', (req, res) =>  {
    res.render('profile')
    res.return()
    loadProfile(req.params.id)
    makePost()
    
})
app.get('/post/:id', (req, res) =>  {
    res.render('post')
    res.return()
    makePost()
    viewPost(req.params.id)
     
})
app.on('/post/:id', (req, res) =>  {
    res.render('post')
    res.return()
    makePost()
    viewPost(req.params.id)
    
})

app.get('/forgot-password', (req, res) =>  {
    res.return()
    res.render('forgot-password')
    res.return()
    forgotPassword()
})
app.on('/forgot-password', (req, res) =>  {
    res.return()
    res.render('forgot-password')
    res.return()
    forgotPassword()
})
app.get('/verify/:token', (req, res) => {
 res.return()
 res.render('verified')
 res.return()
 verifyToken(req.params.token)
})
 app.on('/verify/:token', (req, res) => {
    res.return()
    res.render('verified')
    res.return()
    verifyToken(req.params.token)
 
 })
if(!pb.authStore.isValid && window.location.hash != '#/download'
&& window.location.hash != '#/signup' && window.location.hash != '#/login' && window.location.hash != '#/forgot-password' && window.location.hash.split('/')[1] != 'verify'
){
    window.location.hash = '#/login'
}


setInterval(() => {
    if(!pb.authStore.isValid && window.location.hash != '#/login'  && window.location.hash != '#/signup'  && window.location.hash != '#/forgot-password' && window.location.hash.split('/')[1] != 'verify'
    && window.location.hash != '#/download'
    ){
        pb.authStore.clear()
        window.location.hash = '#/login'
    }else{

    }
}, 1000)