import express from 'express'
import fs from 'fs-extra'
import { readMedia, writeMedia } from '../../lib/fs-tools.js'
import uniqid from 'uniqid'
import { inputValidation } from './validation.js'
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


const mediaRouter = express.Router()

// 
mediaRouter.post('/', inputValidation, async(req,res,next)=>{
    try {
        const mediaArray = await readMedia()
        const newMedia = {imdbId:uniqid(),...req.body, createdAt:new Date (),reviews:[]}
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
        if(req.query && req.query.genre){
            
        }
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

// posting review
mediaRouter.post('/:id/reviews',async(req,res,next)=>{
    try {
        const mediaArray = await readMedia()
        const id = req.params.id
        const index = mediaArray.findIndex(media => media.imdbId === id)
        console.log("id", id, "index",index)
    if(index >= 0){
        const singleMedia = mediaArray[index]
        const newReview = {...req.body, reviewId:uniqid(),createdAt:new Date()}
        singleMedia.reviews.push(newReview)
        mediaArray[index] = singleMedia
        await writeMedia(mediaArray)
        res.send(newReview)
    } else 
        res.send({msg:`media with ${id} not found`})
    } catch (error) {
        res.send({msg:`media with not found`})
        next(error)
    }

})

// getting all reviews
mediaRouter.get('/:id/reviews',async(req,res,next)=>{ 
    try {
         const mediaArray = await readMedia()
         const id = req.params.id
         const reqMedia = mediaArray.find(media => media.imdbId === id)
     if(reqMedia) 

         res.status(200).send(reqMedia.reviews)
      else 
         res.status(200).send({msg:`media with ${id} not found`})
    } catch (error) {
     next(error)
    }
 })

//  getting single review
mediaRouter.get('/:id/reviews/:reviewId',async(req,res,next)=>{ 
    try {
         const mediaArray = await readMedia()
         const id = req.params.id
         const reqMedia = mediaArray.find(media => media.imdbId === id)
     if(reqMedia) {
         const reqReview = reqMedia.reviews.find(review => review.reviewId === req.params.reviewId)
        if(reqReview)
        res.status(200).send(reqReview)
        else
        res.status(200).send({msg:"review not found"})
        }
      else 
         res.status(200).send({msg:`media with ${id} not found`})
    } catch (error) {
     next(error)
    }
 })

 //  editing single review
mediaRouter.put('/:id/reviews/:reviewId',async(req,res,next)=>{ 
    try {
         const mediaArray = await readMedia()
         const id = req.params.id
         const mediaIndex = mediaArray.findIndex(media => media.imdbId === id)
     if(mediaIndex >= 0 ) {
         const reqMedia = mediaArray[mediaIndex]
         const reviewId = req.params.reviewId
         const reviewIndex = reqMedia.reviews.findIndex(review => review.reviewId === reviewId)
        if(reviewIndex >= 0){
            const reqReview = reqMedia[reviewIndex]
            const updatedReview = {...newReview,...req.body,updatedAt: new Date()}
            reqMedia[reviewIndex] = updatedReview
            mediaArray[mediaIndex] = reqReview
            await writeMedia(mediaArray)
            res.status(200).send(reqReview)
        }
        else
        res.status(200).send({msg:"review not found"})
        }
      else 
         res.status(200).send({msg:`media with ${id} not found`})
    } catch (error) {
     next(error)
    }
 })

//  delete review 
mediaRouter.delete('/:id/reviews/:reviewId', async(req,res,next) => {
    try {
        const mediaArray = await readMedia()
        const id = req.params.id
        const mediaIndex = mediaArray.findIndex(media => media.imdbId === id)
        if(mediaIndex >= 0){
            const reqMedia  = mediaArray[mediaIndex]
            const reviewId = req.params.reviewId
            const remainingReviews = reqMedia.reviews.filter(review => review.reviewId !== reviewId)
            reqMedia.reviews = remainingReviews
            mediaArray[mediaIndex] = reqMedia
            res.status(200).send({msg:"review deleted"})
        await writeMedia(mediaArray)
        } else {
            res.status(200).send({msg:"not found"})
        }
    } catch (error) {
        res.status(200).send({msg:"error deleting found"})
        
    }
})




export default mediaRouter