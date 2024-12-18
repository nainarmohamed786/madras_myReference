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
    console.log("mime type",mimeType);
    let destination=rawDir;

   } 
})