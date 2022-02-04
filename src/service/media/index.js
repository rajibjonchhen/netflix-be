import express from 'express'
import fs from 'fs-extra'
import { readMedia, writeMedia } from '../../lib/fs-tools.js'
import uniqid from 'uniqid'
import { inputValidation } from './validation.js'
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from 'multer'
import { checkIfIdExists } from './validation.js' 
const mediaRouter = express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
    cloudinary,
      params:{
        folder:'netflix'
      }
    })
  }).single("image")

mediaRouter.put('/:id/poster',checkIfIdExists, cloudinaryUploader, async(req, res, next) =>{
    try {
        const mediaArray = await readMedia()
        mediaArray[req.index] = {...mediaArray[req.index],Poster:req.file.path }
        await writeMedia(mediaArray)
        res.status(201).send(mediaArray[req.index])
    } catch (error) {
        console.log()
        next(error)
    }
})
// adding image 

//for post movie 
mediaRouter.post('/', inputValidation, async(req,res,next)=>{
    try {
        const mediaArray = await readMedia()
        const newMedia = {imdbId:uniqid(),...req.body, createdAt:new Date (),reviews:[]}
        mediaArray.push(newMedia)
        await writeMedia(mediaArray)
    res.status(201).send(newMedia)
    } catch (error) {
        console.log()
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

mediaRouter.get('/:id', checkIfIdExists , async(req,res,next)=>{
 
   try {
       const mediaArray = await readMedia()
       const reqMedia = mediaArray[req.index]
       console.log(reqMedia)
        res.status(200).send(reqMedia)
   } catch (error) {
    console.log(error)
    next(error)
   }
})

mediaRouter.put('/:id',checkIfIdExists,async(req,res,next)=>{
    try {
        //req.index comimg from checkIfIdExists middleware
        const mediaArray = await readMedia()
        const oldMedia = mediaArray[req.index]
        const updatedMedia = {...oldMedia,...req.body,updatedAt:new Date()}
        mediaArray[req.index] = updatedMedia
        await writeMedia(mediaArray)
        res.send(updatedMedia)
    }catch (error) {
        console.log(error)
        next(error)
    }

})

mediaRouter.delete('/:id',checkIfIdExists, async(req,res,next)=>{
    try {
        const mediaArray = await readMedia()
        const remainingMedia = mediaArray.filter(media => media.id !== req.index)
        await writeMedia(remainingMedia)
    res.send({msg:"deleted single"})
    } catch (error) {
        console.log(error)
        next(error)
    }
})


// posting review
mediaRouter.post('/:id/reviews',checkIfIdExists, async(req,res,next)=>{
    try {
        const mediaArray = await readMedia()
        const singleMedia = mediaArray[req.index]
        const newReview = {...req.body, reviewId:uniqid(),createdAt:new Date()}
        singleMedia.reviews.push(newReview)
        mediaArray[req.index] = singleMedia
        await writeMedia(mediaArray)
        res.send(newReview)

    } catch (error) {
    console.log(error)
    next(error)
    }

})

// getting all reviews
mediaRouter.get('/:id/reviews', checkIfIdExists,async(req,res,next)=>{ 
    try {  
        const mediaArray = await readMedia()
        const reqReviews = mediaArray[req.index].reviews
        console.log('req.index',req.index,'reqReviews',reqReviews)
        res.status(200).send(reqReviews)
    } catch (error) {
      console.log(error)
        next(error)
    }
 })

//  getting single review
mediaRouter.get('/:id/reviews/:reviewId', checkIfIdExists, async(req,res,next)=>{ 
    try {
         const mediaArray = await readMedia()
         const reqReview = mediaArray[req.index].reviews[req.reviewIndex]
        res.status(200).send(reqReview)
         } catch (error) {
            console.log(error)
            next(error)
         }
 })

 //  editing single review
mediaRouter.put('/:id/reviews/:reviewId', checkIfIdExists, async(req,res,next)=>{ 
    try {
            const mediaArray = await readMedia()
            const updatedReview = {...newReview,...req.body,updatedAt: new Date()}
            mediaArray[req.index].reviews[req.reviewIndex] = updatedReview
            await writeMedia(mediaArray)
            res.status(200).send(reqReview)
        } catch (error) {
         console.log(error)
            next(error)
        }
    })
    
    //  delete review 
    mediaRouter.delete('/:id/reviews/:reviewId', checkIfIdExists, async(req,res,next) => {
        try {
        const mediaArray = await readMedia()
            const remainingReviews = mediaArray[req.index].reviews.filter(review => review.reviewId !== req.reviewIndex)
            mediaArray[req.index].reviews = remainingReviews
            res.status(200).send({msg:"review deleted"})
            await writeMedia(mediaArray)
        }
     catch (error) {
         console.log(error)
        next(error)
    }
})




export default mediaRouter