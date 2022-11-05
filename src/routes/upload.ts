import express, { Request, Response } from "express";
// import multerS3  from 'multer-s3'
import AWS from 'aws-sdk'
import multer from 'multer'
import fs from 'fs'
import config from "config";
import { deleteImageStack, uploadFile } from "../utils/s3";
import path from 'path'
import { generateKey } from "crypto";
import { VerifyTokenAndReissue } from "../middleware/jwtvalidate";
const router=express.Router()

const AWS_ACESS=config.get<string>("AWS_ACESS")
const AWS_SECRET=config.get<string>("AWS_SECRET")
const AWS_BUCKET_NAME=config.get<string>("AWS_BUCKET_NAME")
const AWS_BUCKET_REGION=config.get<string>("AWS_BUCKET_REGION")


const s3=new AWS.S3({
    accessKeyId: AWS_ACESS,
    secretAccessKey:AWS_SECRET,
})




const imageStorage = multer.diskStorage({
    // Destination to store image     
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
const imageUpload = multer({
    storage: imageStorage,
}) 

router.post('/images',VerifyTokenAndReissue,imageUpload.single('image'),async(req:Request,res:Response)=>{
    try{
 const file=req.file
   
    console.log(file);
//  const result= await uploadFile(file)
//  console.log(result,'result here');
//     res.json(result)
 function uploadFile (file:any)  {
        // Read content from the file
        const fileContent = fs.readFileSync(file.path);
    
        // Setting up S3 upload parameters
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: file.filename, // File name you want to save as in S3
            Body: fileContent
        };
    
        s3.putObject(params).promise()
        // Uploading files to the bucket
      s3.upload(params,    function (err: any, data: any) {
          if (err) {
              res.status(500).json(err)
          } if (data) {
              console.log(data.Location, 'hehe', data);
              
              res.json({location:data.Location,key:data.key})
          } else {
              console.log('nothing here');
              res.status(404).json({ message: "response not found from s3" }) 
          }
    
      })
    };
  uploadFile(file)
    }catch(err){
        res.status(500).json(err)
    } 
})



router.post('/delete-images',VerifyTokenAndReissue, async (req, res) => {
    try {
      const { imageRefs } = req.body;
      // Calling our helper function
    let result=  await deleteImageStack(imageRefs);
   
      res.status(201).json('image deleted');
    } catch(e) {
      console.log(e);
      res.status(500).json('error happened cannot delete');
    }
  });


export default router

