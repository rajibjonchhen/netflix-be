import express from 'express'
import fs from 'fs-extra'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import createHttpError from 'http-errors'
import morgan from 'morgan'
import helmet from 'helmet'
import mediaRouter from './service/media/index.js'




const server = express()
const port = process.env.PORT || 3001
console.log(port)


const whiteListOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL,process.env.CLOUDINARY_URL]
server.use(cors({origin:function(origin, next){
    if(!origin || whiteListOrigins.indexOf(origin) != -1)
    next(null, true)
    else
    next( new Error('Cors error'))
} }))

server.use(express.json())
server.use(helmet())

console.table(whiteListOrigins)


server.use('/media',mediaRouter)
console.table(listEndpoints(server))

server.listen(port,() =>{
    console.log("Server running on ", port)
})
