import ResearcherModal from '../models/ResearchPaperModel.js'
import path from 'path';
import sharp from 'sharp';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import {fileURLToPath} from 'url';

const __filename=fileURLToPath(import.meta.url);
console.log("__filename",__filename);

const __dirname=path.dirname(__filename);
const processedImageDir=path.join(__dirname,"../uploads/images");
console.log("process Image",processedImageDir);

export const uploadResearchPaper=catchAsyncError(async (req,res,next)=>{
    try{
      const {title,description}=req.body;
      const {files}=req;

      if(files || (!files.image && !files.video && !files.pdf)){
        return next(new ErrorHandler("Please upload at least one file",404));
      }

      const fileData={};

      if(files.image){
        const imageFile=files.image[0];
        const processedImagePath=path.join(processedImageDir,`processesd-${imageFile.filename}`);
        await sharp(imageFile.path)
        .resize(800,800,{fit:"inside"})
        .toFormat("jpeg")
        .toFile(processedImagePath);

        fileData.image=`/uploads/images/${path.basename(processedImagePath)}`;
      }

      if(files.video){
        const videofile=files.video[0];
        fileData.video=`/uploads/videos/${path.basename(videofile.path)}`
      }

      if(files.pdf){
        const pdfFile=files.pdf[0];
        fileData.pdf=`/uploads/pdf/${path.basename(pdfFile.path)}`
      };

      const newResearcher=new ResearcherModal({
        title,
        description,
        ...fileData
      });

      await newResearcher.save();
      res.status(201).json({
        message:"Research paper uploaded successfully",
        data:newResearcher
      })
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
})