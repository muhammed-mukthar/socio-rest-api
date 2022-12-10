"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import multerS3  from 'multer-s3'
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("config"));
const s3_1 = require("../utils/s3");
const path_1 = __importDefault(require("path"));
const jwtvalidate_1 = require("../middleware/jwtvalidate");
const router = express_1.default.Router();
const AWS_ACESS = config_1.default.get("AWS_ACESS");
const AWS_SECRET = config_1.default.get("AWS_SECRET");
const AWS_BUCKET_NAME = config_1.default.get("AWS_BUCKET_NAME");
const AWS_BUCKET_REGION = config_1.default.get("AWS_BUCKET_REGION");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: AWS_ACESS,
    secretAccessKey: AWS_SECRET,
});
const imageStorage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const imageUpload = (0, multer_1.default)({
    storage: imageStorage,
});
router.post("/images", jwtvalidate_1.VerifyTokenAndReissue, imageUpload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        console.log(req.file, req.body, "fsdsfdd");
        function uploadFile(file) {
            const fileContent = fs_1.default.readFileSync(file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: AWS_BUCKET_NAME,
                Key: file.filename,
                Body: fileContent,
            };
            s3.putObject(params).promise();
            // Uploading files to the bucket
            s3.upload(params, function (err, data) {
                if (err) {
                    res.status(500).json(err);
                }
                if (data) {
                    res.json({ location: data.Location, key: data.key });
                }
                else {
                    res.status(404).json({ message: "response not found from s3" });
                }
            });
        }
        uploadFile(file);
    }
    catch (err) {
        console.log(err, "yyhhghgjghjghjhjhgjhg");
        res.status(500).json(err);
    }
});
router.post("/delete-images", jwtvalidate_1.VerifyTokenAndReissue, async (req, res) => {
    try {
        const { imageRefs } = req.body;
        // Calling our helper function
        let result = await (0, s3_1.deleteImageStack)(imageRefs);
        res.status(201).json("image deleted");
    }
    catch (e) {
        res.status(500).json("error happened cannot delete");
    }
});
exports.default = router;
