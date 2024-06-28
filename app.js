if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// require('dotenv').config();

const express = require ('express')
const app = express()
const path = require('path')
const ejsMate= require('ejs-mate')
const mongoose = require('mongoose')
const appError = require('./util/appError')
const methodOverride = require('method-override');
const session= require('express-session')
const MongoStore = require('connect-mongo')
const flash= require('connect-flash')
const passport= require('passport')
const LocalStrategy= require('passport-local')
const User= require('./model/user')
const mongoSanitize= require('express-mongo-sanitize')
const helmet= require('helmet')

const spotRouter= require('./routes/spots')
const reviewRouter= require('./routes/review')
const usersRouter= require('./routes/users')

// process.env.DB_URL || 
const dbUrl=process.env.DB_URL ||  'mongodb://127.0.0.1:27017/travel'
mongoose.connect(dbUrl)
    .then( async() => {
        console.log('working');
    })
    .catch((err) => {
        console.log(' HERE IS A PROBLEM');
        console.log(err);
    }) 

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_override'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.maptiler.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.maptiler.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dpfedgpdk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
                "https://images.wallpaperscraft.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// || process.env.SECRET
const secret= 'havetobestronger' || process.env.SECRET
const store= MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {secret}
})

const sessionConfig={
    store,
    name:'cookie',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure:true, its work in http. uncoment while deploying
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())  // session a nibe
passport.deserializeUser(User.deserializeUser()) // session theke ber kore dbe

//gloval things, have access from every other templet
app.use((req,res,next)=>{
    if(!['/login','/'].includes(req.originalUrl)) {
        req.session.returnTo= req.originalUrl;
    }
    res.locals.currentUser= req.user;
    res.locals.success= req.flash('success')
    res.locals.warning= req.flash('warning')
    res.locals.error= req.flash('error')
    next()
})

app.use('/spots', spotRouter )
app.use('/spots/:id/review', reviewRouter )
app.use('/', usersRouter)
app.use('/', (req,res)=>{
    res.render('pages/home')
})


app.all('*',(req, res, next)=>{ 
    next(new appError('Page Not Found',404))
})
app.use((err, req, res,next)=>{
    const { status= 401}=err
    if(!err.message){ err.message= 'something wrong happend'}
    res.status(status).render('./pages/error',{err})
})  
const port= process.env.port || 3020
app.listen(port, (req, res)=> 
    console.log(`listening from port ${port}`))
                                                  