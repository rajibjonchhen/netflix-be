import express from 'express'
import fs from 'fs-extra'
import { readMedia, writeMedia } from '../../lib/fs-tools.js'
import uniqid from 'uniqid'


const mediaRouter = express.Router()

// 
mediaRouter.post('/',async(req,res,next)=>{
    try {
        const mediaArray = await readMedia()
        const newMedia = {...req.body,id:uniqid(), createdAt:new Date ()}
        mediaArray.push(newMedia)
        console.log(mediaArray)
        await writeMedia(mediaArray)
    res.send(newMedia)
    } catch (error) {
        next(error)
        
    }

})

mediaRouter.get('/',async(req,res,next)=>{
    try {
        const mediaArray = await readMedia()
        console.log(mediaArray)
        res.status(200).send(mediaArray)
    } catch (error) {
        next(error)
        console.log({error:'error'})
    }

})

mediaRouter.get('/:id',async(req,res,next)=>{
   
   try {
        const mediaArray = await readMedia()
        const id = req.params.id
        const reqMedia = mediaArray.find(media => media.id === id)
    if(reqMedia) 
        res.status(200).send(reqMedia)
     else 
        res.status(200).send({msg:`media with ${id} not found`})
   } catch (error) {
    next(error)
   }

})

mediaRouter.put('/:id',async(req,res,next)=>{
   
    try {
        const mediaArray = await readMedia()
        const id = req.params.id
        const index = mediaArray.findIndex(media => media.id === id)
        console.log(id)
        console.log(mediaArray)
    if(index){
        const oldMedia = mediaArray[index]
        const newMedia = {...req.body,updatedAt:new Date()}
        const updatedMedai = {...oldMedia,newMedia}
        res.status().send({msg:"get single"})
    } else 
        res.status().send({msg:`media with ${id} not found`})
    } catch (error) {
        next(error)
    }

})

mediaRouter.delete('/:id',async(req,res,next)=>{
    console.log("I am post")
    const mediaArray = await readMedia()

    res.status().send({msg:"get single"})


})

export default mediaRouter