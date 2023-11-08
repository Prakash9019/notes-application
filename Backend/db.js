const exp=require('express');
const mongoose=require('mongoose');
mongoose.set('strictQuery',true);
// mongodb+srv://Prakash:<password>@cluster0.emqxvew.mongodb.net/?retryWrites=true&w=majority
const connectDB= ()=>{
    mongoose.connect("mongodb+srv://plsprakash2003:Surya_2003@cluster0.zovfnwa.mongodb.net/");
    console.log("connected");
}

module.exports=connectDB;