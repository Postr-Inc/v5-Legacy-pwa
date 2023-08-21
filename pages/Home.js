import { bottomnav } from "../components/bottomnav.js";
import loginForm from "../components/forms/loginForm.js";
import bottomupmodal from "../components/modal/bottomupmodal.js";
import p from "../components/posts.js";
import api from "../src/app.js";
import { component, vhtml, rf } from "../src/public/vader.js";
let currentVersion = '6.0 Beta'
const home = component('home', {
  render : (states, setState, useState, useEffect, useAuth) =>{
    const [isLoggedin, setLogin] = useState('count', api.authStore.isValid)
    let [posts, setPosts] = useState('posts', [])
    useEffect(() => {
      console.log('use effect')
      function handlePosts(){
        api.collection('posts').getList(1, 10, {
          sort:'-created',
          expand: 'author'
        }).then((res) => {
          console.log(res)
          setPosts(res.items)
        })
      }
       if(isLoggedin){
        console.log('logged in')
        handlePosts()
       }
    }, [posts, isLoggedin])
    function increment() {
      setCount(count + 1)
    }
    rf('increment', increment)
    loginForm.on('submit',   (f, e) => {
      console.log(f)
      try {
        f.submitter.disabled = true
        f.submitter.innerHTML = '<span class="loading"></span> Login'
        api.collection('users').authWithPassword(e.username, e.password).then((res) => {
          console.log(res)
          setLogin(true)
          
        })
      } catch (error) {
        setLogin(false)
      }
      
    })
   
     
    // add roles to api.authStore.model
    
     
    
    return vhtml` 
     ${
      !isLoggedin ?  vhtml`
      <div class="p-5">
      ${loginForm.render() }
      </div>
      ` : 
      vhtml`
      
      ${
        posts.length < 1 ? 
        vhtml`
         <div class="h-screen p-5 flex cursor-wait flex-col justify-center font-mono items-center">
         <img src="./src/public/assets/images/logo.png" class="w-16   mx-auto" />
         <h1 class="text-xl  mt-2 fixed bottom-5">Postr ${currentVersion}</h1>
         </div>
        ` : `
        <div class="p-5">
        <div class="flex flex-row justify-between">
         <div class="ring-2 ring-sky-500 rounded-full p-1">
         <img src="https://picsum.photos/200/200" class="rounded-full w-12 h-12" />
         </div>
        </div>
        <div class="divider"></div>
        <div class="flex flex-col gap-5">
        ${
          posts.map((post) => {
            return vhtml`
            ${
               p(post.id).render({...post, currentuser: api.authStore.model, api: api})
            }
            `
          }).join(' ')
        }
        ${bottomnav(api.authStore.model)}
        ${bottomupmodal()}
        </div>
        `
       }
       
      
       
      
      `
    }
    `
  }
     
})

export default home;
