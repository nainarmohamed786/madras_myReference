import ResearcherModal from '../models/ResearchPaperModel.js'
import path from 'path';
import sharp from 'sharp';
import Event from '../models/EventsModal.js';
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
});


export const editResearchPaper = catchAsyncError(async(req,res,next)=>{
  try{
    const {title,description}=req.body;
    const {files}=req;
    if(!files || !files.image && !files.video && !files.pdf){
      return next(new ErrorHandler("Please upload at least one file",404));
    }
    const fileData={};

    if(files.image){
      const imageFile=files.image[0];
      const processedImagePath=path.join(processedImageDir,`processed-${imageFile.filename}`);
      await sharp(imageFile.path).resize(800,800,{fit:"inside"}).toFormat("jpeg").toFile(processedImagePath);
      fileData.image=`/uploads/images/${path.basename(processedImagePath)}`
    }
    if(files.video){
      const videoFiles=files.video[0];
      fileData.video=`/uploads/videos/${path.basename(videoFiles.path)}`
    }

    if(files.pdf){
      const pdfFiles=files.pdf[0];
      fileData.pdf=`/uploads/pdf/${path.basename(pdfFiles.path)}`
    }

    const uploadResearcherPaper=await ResearcherModal.findByIdAndUpdate(
      req.params.id,{
        title,description,...fileData
      },{new:true}
    );

    if(!uploadResearcherPaper){
      return next(new ErrorHandler("Research paper not found",404));
    }

    res.status(200).json({
      message:"Researcher paper updated successfully",
      data:uploadResearcherPaper
    })

  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error."})
  }
});

export const deleteResearchPaper=catchAsyncError(async(req,res,next)=>{
  try{
  const id=req.params.id;

  if(!id){
    return next(new ErrorHandler("Please provide research paper",404));
  }
   const deletePaper= await ResearcherModal.findByIdAndDelete(id);

   if(!deletePaper){
    return next(new ErrorHandler("Research paper not found",404));  
   }

  res.status(200).json({success:true,message:"Researcher paper is deleted successfully"})
  }
  catch(err){
   res.status(500).json({error:"Internal server error"})
  }
});


export const getAllPapers=catchAsyncError(async(req,res,next)=>{
  const page=parseInt(req.query.page) || 1;
  const limit=parseInt(req.query.limit) || 20;
  const startIndex=(page-1) * limit;
  try{
   const totalevents=await Event.countDocuments();

   const events=await ResearcherModal.find().sort({createdAt:-1}).limit(limit).skip(startIndex);
   res.status(200).json({
    success:true,
    events,
    totalevents,
    currentPage:page,
    pages:Math.ceil(totalevents/limit)
   })
  }catch(err){
   res.status(500).json({error:"Internal server error"})
  }
})