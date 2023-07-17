import { login, signup} from "./public/js/auth/auth.js"
import { loadProfile } from "./public/js/user/profile.js"
import { makePost } from "./public/js/user/createPosts.js"
import { loadFeed } from "./public/js/feed/feed.js"
import { viewPost } from "./public/js/post/showPost.js"
const app = new Router()
// route defintions
 
app.use('/')
app.use('/signup')
app.use('/login')
app.use('/profile')
app.use('/post')
// binding root

app.bindRoot('app')

// renders
// either > than 768 or not a pwa  environment
 
window.onresize = () => {
    if(window.screen.width > 768){
        console.log('desktop')
        window.location.hash = '#/pc'
    } 
}  
app.get('/', (req, res) =>  {
 res.render('app')
 res.return()
 makePost()
 loadFeed()
 if(!pb.authStore.isValid){
    res.redirect('/login')
}
})
 
app.on('/', (req, res) =>  {
    res.render('app')
    res.return()
    makePost()
    loadFeed()
     if(!pb.authStore.isValid){
        res.redirect('/login')
    }

    
})
app.get('/login', (req, res) =>  {
    res.return()
    res.render('login')
    res.return()
    login()
    
})
app.on('/login', (req, res) =>  {
    res.return()
    res.render('login')
    res.return()
    login()
  
})
app.root('/', (req, res) =>{
    res.render('app')
    res.return()
    makePost()
    if(!pb.authStore.isValid){
        res.redirect('/login')
    }
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
    res.render('signup')
    res.return()
    signup()
})
app.on('/signup', (req, res) =>  {
    res.render('signup')
    res.return()
    signup()
})
 
 
app.on('/profile/:id', (req, res) =>  {
    res.render('profile')
    res.return()
    loadProfile(req.params.id)
    makePost()
    if(!pb.authStore.isValid){
        res.redirect('/login')
    }
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
