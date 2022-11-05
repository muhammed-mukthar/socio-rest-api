import AWS from 'aws-sdk'
import fs from 'fs'
import config from "config";
import { any } from 'zod';



  
const AWS_ACESS=config.get<string>("AWS_ACESS")
const AWS_SECRET=config.get<string>("AWS_SECRET")
const AWS_BUCKET_NAME=config.get<string>("AWS_BUCKET_NAME")
const AWS_BUCKET_REGION=config.get<string>("AWS_BUCKET_REGION")






const s3=new AWS.S3({
    accessKeyId: AWS_ACESS,
    secretAccessKey:AWS_SECRET,
})



export const uploadFile = async(file:any):Promise<any> => {
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
 await s3.upload(params,   async function (err: any, data: any) {
      if (err) {
          return { message: "error happened here" };
      } if (data) {
          console.log(data.Location, 'hehe', data);
          return data.Location
      } else {
          console.log('nothing here');
          return { message: "response not found from s3" };
      }

  })
};



//image_1667624032345.jpg



  // Helper function to delete (N) images
  export const deleteImageStack = async (imageRefs:any):Promise<any> => {
try{
  // Deleting the image
  await s3.deleteObject({
    Bucket:AWS_BUCKET_NAME,
    Key:imageRefs
  }).promise().then(()=>{
    return  {message:"image deleted successfully",error:false};
  }).catch((err)=>{return {message:"error happened",error:err}});
  
  // Recursively doing so
  
}catch(err){
    return {message:"error happened",error:err}
}
}






// //upload a file to s3
// export function uploadFile(file:any){
//     console.log('file here coe');
    
//     const fileStream=fs.createReadStream(file.path) 
//     const uploadParams={
//         Bucket:AWS_BUCKET_NAME,
//         Body:fileStream,
//         key:file.filename
//     }
//     return s3.upload(uploadParams).promise()
// }





//download a file from s3


