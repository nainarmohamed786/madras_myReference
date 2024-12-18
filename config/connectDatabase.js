import mongoose from "mongoose";

const databaseConnect=()=>{
    console.log(process.env.DATABASE_URL)
    mongoose
    .connect(process.env.DATABASE_URL,{dbName:process.env.DATABASE_NAME})
    .then(()=>console.log("Database is connected successfully"))
    .catch((err)=>console.log("db is failed to connect" + err))
};

export default databaseConnect;