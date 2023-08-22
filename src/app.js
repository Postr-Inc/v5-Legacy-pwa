import VaderRouter from "vaderjsRouter";
import Pocketbase from "pocketbase"

import home from "../pages/Home.js";
import { register } from "../pages/Signup.js";
import profile from "../pages/Profile.js"

const api = new Pocketbase('https://postr.pockethost.io')
api.autoCancellation(false)
export default api
const app = new VaderRouter('/home')

app.use('/profile')
app.use('/register')
app.use('/home')
app.get('/home',  (req, res) => {
   res.render('#app',   home.render())
})
app.on('/home',   (req, res) => {
   res.render('#app',  home.render())
})
app.get('/register',   (req, res) => {
   res.render('#app',   register(api).render())
})
app.on('/register', async (req, res) => {
   res.render('#app',  register(api).render())
})
app.get('/profile',   (req, res) => {
   res.render('#app',   profile(api).render())
})
app.on('/profile', async (req, res) => {
   res.render('#app',  profile(api).render())
})
app.start()
 