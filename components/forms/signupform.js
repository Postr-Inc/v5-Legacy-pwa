import { form, vhtml } from "vaderjs"
const signupform = form({
    name: 'signupForm',
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
        text: `Continue
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
      </svg>
        `,
        styles: {
             
        },
        attributes: {
            class: 'btn btn-ghost border-slate-200 hover:cursor-pointer hover:bg-transparent hover:border-sky-500'
        }
    },
    inputs: {
       username:{
         attributes: {
            class: 'input input-md w-full'
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
            class: 'input  input-md'
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
        
         
        `,
        before: vhtml`
        <div class="justify-center flex mx-auto w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-24 h-24">
        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
        </div>
        `
        
    },
    

    

 })
 export default  signupform