function googleclick(){
  
  dox.getId('googleloginbtn').on('click', async () => {
    pb.authStore.clear()
    const redirect = () =>{
     window.location.href = '#/'
    }
    const data = await pb.collection('users').authWithOAuth2({provider:'google', createData:{
      bio: 'I am new to Postr!',
      followers: [],
    }});
    redirect()
    if(data.meta.isNew){
      let url  = data.meta.avatarUrl
      let form = new FormData()
      fetch(url).then((res) => res.blob()).then((blob) => {
         form.append('avatar', blob)
         pb.collection('users').update(data.record.id, form)
         redirect()

      })
    }
   
 })
}

export function login(){
  if(document.getElementById('loginbtn') && document.getElementById('googleloginbtn')){
    dox.getId('loginbtn').on('click', () => {
        let username = getState('username')
        let password = getState('password')
        if(!username || !password){
          dox.getId('loginbtn').html('Please fill out all fields')
          dox.getId('loginbtn').css('background-color', 'red')
          setTimeout(() => {
            dox.getId('loginbtn').html('Login')
            dox.getId('loginbtn').css('background-color', 'blue')
          }, 3000)
          return
        }
        dox.getId('loginbtn').html('Logging in...')
       try {
        pb.collection('users').authWithPassword(username, password).then((res) => {
          window.location.href = '#/'
           window.location.reload()
           
        })
       } catch (error) {
        alert('Invalid username or password')
       }
        
    })

 
     
  }
}
export  async function signup(){
   if(dox.getId('signupbtn')){
    dox.getId('signupbtn').on('click', async () => {
        let username = getState('username')
        let password = getState('password')
        let email = getState('email')
        let form = new FormData()
        form.append('username', username)
        form.append('password', password)
        form.append('passwordConfirm', password)
        form.append('email', email)
        form.append('bio', 'I am new to Postr!')
        form.append('followers', JSON.stringify([]))
        try {
          await pb.collection('users').create(form)
          window.location.href = '#/login'
        } catch (error) {
          console.log(error.data.data)
          if(error.data.data['email']){
            console.log('email')
            document.getElementById('email').classList.toggle('border-red-500', true)
            document.getElementById('email').classList.toggle('border-slate-500', false)
            document.getElementById('email').value = error.data.data['email'].message
            setTimeout(() => {
              document.getElementById('email').classList.toggle('border-red-500', false)
              document.getElementById('email').classList.toggle('border-slate-500', true)
              document.getElementById('email').value = ''
            }, 3000)
          } 
          if(error.data.data['username']){
            console.log('username')
            document.getElementById('username').classList.toggle('border-red-500', true)
            document.getElementById('username').classList.toggle('border-slate-500', false)
            document.getElementById('username').value = error.data.data['username'].message
            setTimeout(() => {
              document.getElementById('username').classList.toggle('border-red-500', false)
              document.getElementById('username').classList.toggle('border-slate-500', true)
              document.getElementById('username').value = ''
            }, 3000)
          }
          if(error.data.data['password']){
            document.getElementById('password').classList.toggle('border-red-500', true)
            document.getElementById('password').classList.toggle('border-slate-500', false)
            document.getElementById('password').value = error.data.data['password'].message
          }
        }
    })
    
   }
   googleclick()
}

export async function forgotPassword(){
   dox.getId('forgotbtn').on('click', async () => {
     if(!getState('email') || !/\S+@\S+\.\S+/.test(getState('email'))){
       alert(!getState('email') ? 'Please fill out all fields' : 'Please enter a valid email')
       dox.querySelector('#email').classList.toggle('border-red-500', true
       )
       dox.querySelector('#email').classList.toggle('border-slate-500', false)

        setTimeout(() => {
          dox.querySelector('#email').classList.toggle('border-red-500', false
          )
          dox.querySelector('#email').classList.toggle('border-slate-500', true)
        }, 3000)
        return
     } 
      let email = getState('email')
      console.log(email)
      await pb.collection('users').requestPasswordReset(email)
      confirm('If an account with that email exists, you will receive an email with a link to reset your password.')
      window.location.href = '#/login'
   })
}

export async function verifyToken(){
  let token = window.location.hash.split('/')[2]
 
  dox.getId('setpassword').on('click', async () => {
    let password = getState('password')
    let passwordConfirm = getState('confirmPassword')
     if(!password || !passwordConfirm || password != passwordConfirm){
       
         
       dox.getId('password').classList.toggle('border-red-500', true)
        dox.getId('password').classList.toggle('border-slate-500', false)
        dox.getId('confirmPassword').classList.toggle('border-red-500', true)
        dox.getId('confirmPassword').classList.toggle('border-slate-500', false)
        alert(!password || !passwordConfirm ? 'Please fill out all fields' : 'Passwords do not match')
        setTimeout(() => {
          dox.getId('password').classList.toggle('border-red-500', false)
          dox.getId('password').classList.toggle('border-slate-500', true)
          dox.getId('confirmPassword').classList.toggle('border-red-500', false)
          dox.getId('confirmPassword').classList.toggle('border-slate-500', true)
        }, 3000)

        return
     }

     try {
      await pb.collection('users').confirmPasswordReset(
        token,
        password,
        passwordConfirm
     );
      alert('Password successfully reset!')
      window.location.href = '#/login'
     } catch (error) {
      console.log(error.data)
       if(error.data.data.token){
        alert(error.data.data.token.message)
        dox.getId('verify-container')
        .html(`
        <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl font-bold   flex gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-error w-24">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>
        Token Expired Or   Invalid</h1>
        <p class="mt-2">Please request a new token by clicking the button below.</p>
         
        <div class="divider"></div>
        <a href="#/forgot-password" class="btn btn-sm w-full border-slate-500 btn-ghost hover:border-sky-500">Request New Token</a>
      
        </div>`)
       }
     }
     
  })
}