"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageStack = exports.uploadFile = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("config"));
const AWS_ACESS = config_1.default.get("AWS_ACESS");
const AWS_SECRET = config_1.default.get("AWS_SECRET");
const AWS_BUCKET_NAME = config_1.default.get("AWS_BUCKET_NAME");
const AWS_BUCKET_REGION = config_1.default.get("AWS_BUCKET_REGION");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: AWS_ACESS,
    secretAccessKey: AWS_SECRET,
});
const uploadFile = async (file) => {
    // Read content from the file
    const fileContent = fs_1.default.readFileSync(file.path);
    // Setting up S3 upload parameters
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.filename,
        Body: fileContent
    };
    s3.putObject(params).promise();
    // Uploading files to the bucket
    await s3.upload(params, async function (err, data) {
        if (err) {
            return { message: "error happened here" };
        }
        if (data) {
            return data.Location;
        }
        else {
            return { message: "response not found from s3" };
        }
    });
};
exports.uploadFile = uploadFile;
//image_1667624032345.jpg
// Helper function to delete (N) images
const deleteImageStack = async (imageRefs) => {
    try {
        // Deleting the image
        await s3.deleteObject({
            Bucket: AWS_BUCKET_NAME,
            Key: imageRefs
        }).promise().then(() => {
            return { message: "image deleted successfully", error: false };
        }).catch((err) => { return { message: "error happened", error: err }; });
        // Recursively doing so
    }
    catch (err) {
        return { message: "error happened", error: err };
    }
};
exports.deleteImageStack = deleteImageStack;
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
