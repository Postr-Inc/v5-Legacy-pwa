import React, {useState} from 'react'
import { api } from '..'
import logo from '../images/logo.png'
import googleIcon from '../images/googleicon.png'
const Home = () =>{
    let [isLogin, setIsLogin] = useState(api.authStore.isValid)
    function handleSubmit(e){
        console.log(e)
    }
    return(
       isLogin ? <div>Logged in</div> : 

       <div className="flex flex-col  text-sm justify-center  font-mono ">
         <form onSubmit={handleSubmit} className="flex mt-26 text-start flex-col   justify-center w-full p-5">
            <div className='flex flex-row mx-auto gap-2'>
               <img src={logo}  width={30} height={30} className='mr-2' />
                <h1 className="text-xl   ">Postr</h1>
             </div>
               
            <label className='label'>
                 Username
            </label>
            <input type="text" className="border focus:outline-none border-gray-200 rounded-md p-2 w-full" />

            <label>
                  Password
            </label>
            <input type="password" className="focus:outline-none mt-2 border border-gray-200 rounded-md p-2 w-full" />
            <button type="submit" className="mt-2 btn btn-sm btn-ghost border-slate-400 w-full">
                  Login
            </button>
            <div className="mt-2 ">
               <a href="/signup" className="text-blue-500 underline">Sign up</a>
            </div>
            <div className='divider'>Or</div>
            <button className='btn btn-sm btn-ghost border-slate-400 w-full'>
            <img src={googleIcon} width={20} height={20} className='mr-2' />
             Continue with Google
            </button>
        </form>
       </div>
    )
}
export default Home
