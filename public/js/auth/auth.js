export function login(){
  if(dox.getId('loginbtn')){
    dox.getId('loginbtn').on('click', () => {
        let username = getState('username')
        let password = getState('password')
        pb.collection('users').authWithPassword(username, password).then((res) => {
            window.location.href = '#/'
        })
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
}