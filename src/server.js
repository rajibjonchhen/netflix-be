import express from 'express'
import fs from 'fs-extra'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import createHttpError from 'http-errors'
import morgan from 'morgan'
import helmet from 'helmet'
import mediaRouter from './service/media/media.js'
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler} from './service/error-handler.js'



const server = express()
const port = process.env.PORT || 3001
console.log(port)

// cors with origin
const whiteListOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]
console.table(whiteListOrigins)
server.use(cors({origin:function(origin, next){
    if(!origin || whiteListOrigins.indexOf(origin) != -1)
    next(null, true)
    else
    next( new Error('Cors error'))
} }))

// express json
server.use('/media',mediaRouter)
server.use(express.json())
server.use(helmet())


// router


// error handler
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

// server listner
server.listen(port,() =>{
    console.log("Server running on ", port)
})

// server 
server.on('error',(error)=>{
    console.log(error)
})
