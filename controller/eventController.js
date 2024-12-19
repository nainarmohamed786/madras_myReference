import EventModal from "../models/EventsModal";
import catchAsyncError from "../middlewares/catchAsyncError";
import {fileURLToPath} from 'url';
import path from 'path';
import sharp from "sharp";
import ErrorHandler from "../utils/ErrorHandler";


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const processedImage=path.join(__dirname,"../uploads/images");


export const uploadEvents=catchAsyncError(async (req,res,next)=>{
    try{
      const {title,description}=req.body;
      const {files}=req;

      if(!files || (!files.image && !files.video && !files.pdf)){
        return next(new ErrorHandler("Please upload at least one file",404))
      };

      const fileData={};

      if(files.image){
        const imageFiles=files.image[0];
        const ProcessedImagePath=path.join(processedImage,`processed-${imageFiles.filename}`);


        await sharp(imageFiles.path).resize(800,800,{fit:"inside"}).toFormat("jpeg").toFile(ProcessedImagePath);

        fileData.image=`/upload/images/${path.basename(ProcessedImagePath)}`
      }

      if(files.video){
        const videoFile=files.video[0];
        fileData.video=`/uploads/video/${path.basename(videoFile.path)}`
      }

      if(files.pdf){
        const pdfFile=files.pdf[0];
        fileData.pdf=`/uploads/pdf/${path.basename(pdfFile.path)}`
      }

      const uploadEvents=await EventModal.create({
        title,
        description,
        ...fileData
      });
      await uploadEvents.save();

      res.status(200).json({
        success:true,
        uploadEvents
      })
    }
    catch(err){

    }
})