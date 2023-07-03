import express from 'express'
const app = express()
import mongoose from 'mongoose'
import authRoute from './routes/auth.route.js'
import usersRoute from './routes/users.route.js'
import petsRoute from './routes/pets.route.js'
import sittersRoute from './routes/sitters.route.js'
import conversationRoute from './routes/conversations.route.js'
import messageRoute from './routes/messages.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import config from './utils/config.js'
import cookieSession from 'cookie-session'
import passport from 'passport'
import initializePassport from './utils/passportConfig.js'

const connectDB = async() => {
    try {
        await mongoose.connect(config.mongoUrl)
        console.log('db connected');
    } catch (error) {
        throw error
    }
}


// If for some reason (after the first succesful connection) the connection is lost it will try to reconnect again.
// is proven below with those listeners...
mongoose.connection.on('disconnect', ()=>{
    console.log('server disconnected');
})
mongoose.connection.on('connected', ()=>{
    console.log('server connected');
})

const corsOptions = {
    origin: 'https://www.petsitterfinder.com.ar', //included origin as true
    methods: "GET,POST,PUT,DELETE",
    credentials: true, //included credentials as true
};


//'https://www.petsitterfinder.com.ar'

app.use(cookieParser('asdasd'))
app.use(cookieSession({
        secret: 'asdasd',
        httpOnly: true,
        sameSite: 'none',
}))

app.use('/static', express.static('public'))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOptions))

app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/pets', petsRoute)
app.use('/api/sitters', sittersRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)

app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong'
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})



app.listen(config.port, async() => { 
    await connectDB()
    console.log(`Server running on port ${config.port}...`);
})
