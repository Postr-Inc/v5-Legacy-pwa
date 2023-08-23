import React, {useEffect, useState} from 'react'
import { api } from '..'
import logo from '../images/logo.png'
import googleIcon from '../images/googleicon.png'
import { Post } from '../components/post'
let currentVersion = '6.0 Beta'
 
const Home = () =>{
    let [isLogin, setIsLogin] = useState(api.authStore.isValid)
    let [btnstate, setBtnState] = useState('Login')
    let [posts, setPosts] = useState([])
    async function login(e){
        e.preventDefault()
        let username = e.target[0].value
        let password = e.target[1].value
        if(username == '' || password == ''){
            alert('Please fill all fields')
            return
        }
        setBtnState('loader')
        try {
         await api.collection('users').authWithPassword(username, password)
         if(api.authStore.isValid){
           setIsLogin(true)
         }       
        } catch (err){
          alert('please check credentials - if you do not know your login info then click forgotten passwor')
        }
       
    }
    useEffect(()=>{
        if(isLogin){
            api.collection('posts').getList(1, 50).then((res)=>{
                setPosts(res.items)
            })
        }
    }, [posts])
    return(
       isLogin ? 
      
       posts.length == 0 ? 
       <div class="h-screen p-5 flex cursor-wait flex-col justify-center font-mono items-center">
       <img src={logo} class="w-16 mx-auto" />
       <h1 class="text-xl mt-2 fixed bottom-5">Postr {currentVersion}</h1>
      </div>

       : 
       <div class="p-5">
       <div class="flex flex-row justify-between">
         <div class="ring-2 ring-sky-500 rounded-full p-1">
           <img src="https://picsum.photos/200/200" class="rounded-full w-12 h-12" />
         </div>
       </div>
       <div className='divider'></div>
       <div class="flex flex-col gap-5" key="postcontainer">
       
         {posts.map((post)=>{
            return(
                <div
                key={post.id}
                >
                  <Post content={post.content} author={post.expand.author} file={post.file}/>
                </div>
            )
         }).reverse()}
        
              
        </div>
       </div>

       
       : 

       <div className="flex flex-col  text-sm justify-center  font-mono ">
         <form onSubmit={login} className="flex mt-26 text-start flex-col   justify-center w-full p-5">
            <div className='flex flex-row mx-auto gap-2'>
               <img src={logo}  width={30} height={30} className='mr-2' />
                <h1 className="text-xl   ">Postr</h1>
             </div>
               
            <label className='label'>
                 Username
            </label>
            <input type="text" className="input input-bordered input-md border focus:outline-none border-gray-200 rounded-md p-2 w-full" />
            <label className='mt-2'>
                  Password
            </label>
            <input type="password" className="input input-bordered input-md focus:outline-none mt-2 border border-gray-200 rounded-md p-2 w-full" />
            <button type="submit" className="btn btn-ghost mt-2 border-slate-200 hover:cursor-pointer hover:bg-transparent hover:border-sky-500"
            {...btnstate == 'loader' ? {disabled: true} : {}}
            >
                {btnstate  == 'loader' ?   <span class="loading loading-spinner loading-sm"></span>   : ''}
                Login
                
            </button>
            <div class="mt-5" >Dont have an account? <a href="#/register" class="text-sky-500">Signup</a></div>
            <div className='divider'>Or</div>
            <button className='btn   btn-ghost border-slate-200  w-full'>
            <img src={googleIcon} width={20} height={20} className='mr-2' />
             Continue with Google
            </button>
        </form>
       </div>
    )
}
export default Home
