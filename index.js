import http from "http";
import express from 'express'
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
import { Server } from 'socket.io';
import WebSockets from "./utils/socket.js";
import { ConversationModel } from './models/conversation.model.js'
import { UserModel } from './models/user.model.js'
import { MessageModel } from './models/message.model.js'
import { PetModel } from './models/pet.model.js'

const app = express()
const port = config.port || "5000";
app.set("port", port);

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

app.use(
    cors({
        origin: ['http://localhost:3000','https://www.petsitterfinder.com.ar', 'https://www.petsitterfinder.com.ar/', 'https://api.petsitterfinder.com.ar', 'https://api.petsitterfinder.com.ar/'],
        credentials: true,
        methods: 'POST,PUT,DELETE,PATCH,OPTIONS'
    })
  )


//'https://www.petsitterfinder.com.ar/'

app.use(cookieParser(config.cookieSecret))

app.use(cookieSession({
        secret: config.cookieSecret,
        keys: ['asdasd', 'qweqwe']
}))

app.use('/static', express.static('public'))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req,res)=>res.json({
    message: 'Welcome to petsitterfinder API'
}))

app.get('/deleteDB', async(req,res, next)=>{
    try {
        await ConversationModel.deleteMany({})
        await UserModel.deleteMany({})
        await MessageModel.deleteMany({})
        await PetModel.deleteMany({})
        res.json({
            status:'ok',
        })
    } catch (error) {
        next(error)   
    }

})

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


/** Create HTTP server. */
const server = http.createServer(app);
/** Create socket connection */
global.io = new Server(server, {
    cors: {
      origin:['http://localhost:3000','https://www.petsitterfinder.com.ar', 'https://www.petsitterfinder.com.ar/', 'https://api.petsitterfinder.com.ar', 'https://api.petsitterfinder.com.ar/'],
      credentials: true
    }});
global.io.on('connection', WebSockets.connection)
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", async() => {
    await connectDB()
    console.log(`Server running on port ${config.port}...`);
});

