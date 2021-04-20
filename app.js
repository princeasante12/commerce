const express = require("express")
const session = require("express-session")
const app = express()
const shopRoutes = require("./routes/shop")
const Mongoose = require("mongoose")
const authRoutes = require("./routes/auth")

const bodyParser = require('body-parser')

const multer = require('multer')


const path = require('path')
const mongoDbStore = require("connect-mongodb-session")(session)

const store = new mongoDbStore({
    uri : "mongodb+srv://prince:prince123@cluster0.nkfoh.mongodb.net/project?retryWrites=true&w=majority",
    collection : "sessions"
})

app.set('view engine', 'ejs')
app.set('views', 'views')

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'images')
    },
    filename : (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true)
    } else {
        callback(null, true)
    }
}

app.use(bodyParser.urlencoded({extended : false }))

app.use(session({ secret : "mysecretsecret", saveUninitialized : false, resave : false, store : store }))

// app.use(csrfProtection)

app.use((req, res, next) => {
    // res.locals.csrfToken = req.csrfToken()
    res.locals.isAuthenticated = req.session.isAuth
    next()
})

app.use(express.static(path.join(__dirname, 'public')))
app.use( "/images",express.static(path.join(__dirname, 'images')))

app.use(multer({ storage : storage, fileFilter : fileFilter }).single('image'))

app.use(shopRoutes)
app.use(authRoutes)
// app.use((error, req, res, next) => {
//     res.send("Error!! Serverside error")
// })


Mongoose.connect("mongodb+srv://prince:prince123@cluster0.nkfoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology : true }).then(res => {
console.log("connected")
    app.listen(2000)
})
.catch(error => console.log(error))
