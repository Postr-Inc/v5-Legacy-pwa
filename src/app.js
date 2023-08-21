import VaderRouter from "vaderjsRouter";
import home from "../pages/Home.js";
import Pocketbase from "pocketbase"
import { register } from "../pages/Signup.js";
const api = new Pocketbase('https://postr.pockethost.io')
api.autoCancellation(false)
export default api
const app = new VaderRouter('/home')
app.use('/register')
app.use('/home')
app.get('/home',  (req, res) => {
   res.render('#app',   home.render())
})
app.on('/home',   (req, res) => {
   res.render('#app',  home.render())
})
app.get('/register',   (req, res) => {
   res.render('#app',   register.render())
})
app.on('/register', async (req, res) => {
   res.render('#app',  register.render())
})
app.start()
 
