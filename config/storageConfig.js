import multer from "multer";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const baseDir=path.join(__dirname,'../uploads');
const imageDir=path.join(baseDir,"images");
const videoDir=path.join(baseDir,'videos');
const pdfDir=path.join(baseDir,'pdf');
const rawDir=path.join(baseDir,'raw');

const fileSizeLimit={
    'image/':5 * 1024 * 1024,
    'video/':50 * 1024 * 1024,
    'application/pdf':10 * 1024 * 1024
};



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        const mimeType=file.mimetype;
        let destination=rawDir;

        if(mimeType.startsWith("image/")){
            destination=imageDir;
        }
        else if(mimeType.startsWith("video/")){
            destination=videoDir;
        }
        else if(mimeType==="application/pdf"){
            destination=pdfDir
        }
        cb(null,destination);
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random() * 1e9);
        cb(null,`${uniqueSuffix}-${file.originalname}`)
    },
});



const upload=multer({
    storage,
    fileFilter:(req,file,cb)=>{
        const allowedMimeTypes=[
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
            "application/pdf"
        ];

        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null,true);
        }
        else{
            cb(new Error("Invalid file type. Allowed: JPEG PNG GIF MP4 PDF."))
        }
    },
    limits:{
        fileSize:(req,file,cb)=>{
            const mimeType=file.mimeType;

            const limit=Object.keys(fileSizeLimit).find(type=>mimeType.startsWith(type));

            if(limit && file.size > fileSizeLimit[limit]){
               return cb(new Error(`File size exceeds limit of ${fileSizeLimit[limit] / (1024 * 1024)}MB for ${mimeType}`))
            }
            cb(null,true)
        }
    }
});

export default upload;