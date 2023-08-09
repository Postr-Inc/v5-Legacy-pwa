import {googleclick,  signup, forgotPassword, verifyToken} from "./public/js/auth/auth.js"
import { loadProfile } from "./public/js/user/profile.js"
import { makePost } from "./public/js/user/createPosts.js"
import { loadFeed } from "./public/js/feed/feed.js"
import { viewPost } from "./public/js/post/showPost.js"
import { handleNotifications } from "./public/js/user/notifications.js"
import { GetTopAccounts } from "./public/js/user/search.js"
const app = new Router()
// route defintions
app.use('/')
app.use('/signup')
app.use('/login')
app.use('/profile')
app.use('/post')
app.use('/search')
// binding root

app.bindRoot('app')
 
if(pb && pb.authStore.isValid && 
    // stadalone
    window.matchMedia('(display-mode: standalone)').matches
    ){
    try {
    pb.collection('users').authRefresh()
    handleNotifications()
 } catch (error) {
    window.location.href = '#/login'
 }
 
}

// check if running in a pwa or not'
 
app.get('/', (req, res) =>  {
 res.render('feed')
 res.return()
 makePost()
 loadFeed()
 dox.getId('userAvatar').setAttribute('src',  `https://postr.pockethost.io/api/files/_pb_users_auth_/${pb.authStore.model.id}/${pb.authStore.model.avatar}`)
 
})
 
app.on('/', (req, res) =>  {
    res.render('feed')
    res.return()
    makePost()
    loadFeed()
    
      
})
app.root('/', (req, res) =>{
    res.render('feed')
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
app.get('/settings', (req, res)=>{
    res.render('settings')
    res.return()
})
app.on('/settings', (req, res)=>{
    res.render('settings')
    res.return()
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
app.on('/search', (req, res) =>  {
    res.render('search')
    res.return()
    GetTopAccounts()
})
app.get('/search', (req, res) =>  {
    res.render('search')
    res.return()
    GetTopAccounts()
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

 app.on('/terms', (req, res) => {
    res.return()
    res.render('terms')
    res.return()
 
 })
    app.get('/terms', (req, res) => {
        res.return()
        res.render('terms')
        res.return()
    }) 
    app.get('/privacy', (req, res) => {
        res.return()
        res.render('privacy')
        res.return()
    })
    app.on('/privacy', (req, res) => {
        res.return()
        res.render('privacy')
        res.return()
    })
setInterval(() => {
    if(!pb.authStore.isValid && window.location.hash != '#/login'  && window.location.hash != '#/signup'  && window.location.hash != '#/forgot-password' && window.location.hash.split('/')[1] != 'verify'
    && window.location.hash != '#/download'
    ){
        pb.authStore.clear()
        window.location.hash = '#/login'
    } 
}, 1000)
