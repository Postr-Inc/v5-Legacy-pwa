import VaderRouter from "vaderjsRouter";
import home from "../pages/Home.js";
import Pocketbase from "pocketbase"
const api = new Pocketbase('https://postr.pockethost.io')
api.autoCancellation(false)
export default api
const app = new VaderRouter('/')
app.use('/register')
app.use('/')
app.get('/', async (req, res) => {
   res.render('#app', await home.render())
})
app.start()
 