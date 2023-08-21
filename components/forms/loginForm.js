import { form, vhtml } from "vaderjs"
const loginForm = form({
    name: 'loginForm',
    fields: {
        username: {
            type: 'text',
            label: 'Username',
            required: true,
            value: '',
            placeholder: 'Enter your username',
            label: 'Username',
        },
        password: {
            type: 'password',
            label: 'Password',
            required: true,
            value: '',
            label: 'Password',
            placeholder: 'Enter your password'
        }
    
    },
    button:{
        text: 'Login',
        styles: {
             
        },
        attributes: {
            class: 'btn btn-ghost border-slate-200 hover:cursor-pointer hover:bg-transparent hover:border-sky-500'
        }
    },
    inputs: {
       username:{
         attributes: {
            class: 'input input-bordered input-md w-full'
         },
         label: {
            name: 'Username',
            attributes: {
                class: 'label'
            }
        }
       },
       password:{
        attributes: {
            class: 'input input-bordered input-md'
        },
        label: {
            name: 'Password',
            attributes: {
                class: 'label'
            }
        }
       }
    },
    attributes: {
        class: 'flex flex-col text-sm gap-2 w-full mx-auto '
    },
    append: {
        after: vhtml`
        <a href="/register" class="link text-orange-500 ">Forgot Password?</a>
        <div class="divider text-gray-500">Or</div>
        <button class="btn btn-ghost w-full  border-slate-200 hover:cursor-pointer hover:bg-transparent hover:border-sky-500">
        <img src="/src/public/assets/images/googleicon.png" class="w-5 h-5 inline mr-2"/> Continue with Google
        </button>
        `,
        before: vhtml`
         <h1 class="flex justify-center mx-auto text-2xl font-mono font-bold">
              <img src="/src/public/assets/images/logo.png" class="w-10 h-10 inline mr-2"/> Postr
            </h1>
        `
        
    },
    

    

 })
 export default loginForm