import mongoose, { Schema } from "mongoose";



const taskSchema = new mongoose.Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  taskName:{
   type:String,
   lowercase:true,
  trim:true,
  required:true,

  },
  taskDetails:{
    type:String,
    required:[true,"Task details is required to let you know what to do!"],

  },
  taskStatus:{
    type:String,
  enum: ["started", "in-progress", "completed"],
  default:"started"
  }
},{
  timestamps:true
});


export const Task = mongoose.model("Task",taskSchema);