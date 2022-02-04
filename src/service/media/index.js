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
        await writeMedia(mediaArray)
    res.status(201).send(newMedia)
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
        console.log("id", id, "index",index)
    if(index >= 0){
        const oldMedia = mediaArray[index]
        const updatedMedia = {...oldMedia,...req.body,updatedAt:new Date()}
        mediaArray[index] = updatedMedia
        await writeMedia(mediaArray)
        res.send(updatedMedia)
    } else 
        res.send({msg:`media with ${id} not found`})
    } catch (error) {
        res.send({msg:`media with not found`})
        next(error)
    }

})

mediaRouter.delete('/:id',async(req,res,next)=>{
    
    const mediaArray = await readMedia()
    const remainingMedia = mediaArray.filter(media => media.id !== req.params.id)
    await writeMedia(remainingMedia)
    res.send({msg:"deleted single"})


})

export default mediaRouter