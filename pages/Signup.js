import { component, vhtml, rf} from "vaderjs";
import signupform from "../components/forms/signupform.js";
import bottomupmodal from "../components/modal/bottomupmodal.js";
 

export const register = (api) => component('register', {
    render: (states, setState, useState, useEffect, useAuth, useSyncStore, props) => {
        let [authChoice, setAuthChoice] = useState('authChoice', '')
        let [showAvatar, setShowAvatar] = useState('showAvatar', false)
        function setAuth(e) {
            setAuthChoice(e)
        }
        useEffect(async () => {
        signupform.on('submit', async (e, f) =>{
            const data = {
            "username": f.username,
            "email": "",
            "emailVisibility": true,
            "password":  f.password,
            "passwordConfirm": f.password,
            "bio": "test",
            "online": true,
            "followers": JSON.stringify([]),
            "validVerified": false,
            "Isprivate":  false,
            "role": "user",
            };
      
            try {
                await api.collection('users').create(data)
                await api.collection('users').authWithPassword(f.username, f.password)
                .then((res) => {
                    window.location.reload()
                })
                
            } catch (error) {
                 alert(error.message)
            }
       
          })
        }, [])
        rf('authChoice', setAuth)
        return authChoice == '' ?
        vhtml`
        ${localStorage.getItem('pocketbase_auth')  ? window.location.hash = "#/home": vhtml`
        
         <div class="w-full font-mono flex  p-5 flex-col gap-5 h-screen  mx-auto justify-center hero" >
         <h1 class="text-3xl     font-bold">Hello There!</h1>
        ${
            setTimeout(() => {
                document.querySelector('.hero') ? document.querySelector('.hero').classList.add('animate-pulse') : ''
                document.querySelector('.p2') ? document.querySelector('.p2').classList.add('hidden') : ''
            }, 1000),
            setTimeout(() => {
                document.querySelector('.hero') ? document.querySelector('.hero').classList.remove('animate-pulse') : ''
                document.querySelector('.hero') ? document.querySelector('.hero').classList.add('hidden') : ''
                document.querySelector('.p2') ? document.querySelector('.p2').classList.remove('hidden') : ''
            }, 2000),
            ""
        }
        <span class="loading"></span>
        </div>
        `}

        <div class="flex justify-center p2 hero p-5  mt-24  flex-col gap-5 hidden text-2xl w-full mx-auto">
        
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-24 h-24">
        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
        <h1 class="text-2xl font-mono">Choose Account Type</h1>
      
         ${
            /***
             * @todo - make buttons work
             *  account type buttons
             */""
         }
         <div class="flex flex-col mt-16 gap-2">
         <button 
         onclick="authChoice('google')"
         class="btn btn-ghost w-full  border-slate-200 hover:cursor-pointer hover:bg-transparent hover:border-sky-500">
        <img src="/src/public/assets/images/googleicon.png" class="w-5 h-5 inline mr-2"/> Continue with Google
        </button>

        <div class="divider text-gray-500 text-md">Or</div>

        <button 
        onclick="authChoice('email')"
        class="btn flex gap-5 btn-ghost w-full  border-slate-200 hover:cursor-pointer hover:bg-transparent hover:border-sky-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
      </svg>
       Email & Password
        </button>
         </div>
        </div>

         
        
        `
        :   authChoice == 'google' ?  `` : 
        `
        <div class="flex  hero mx-auto mt-16 justify-center w-full p-5">
         
        ${signupform.render()}
        
        </div>
        `  
        
       
         
    }
})

