import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createTask= asyncHandler(async(req,res)=>{
  const userId = req.user?._id;
     if(!userId)
     {
       throw new ApiError(400,"Login first to create the  task")
     }

    const { taskName,taskDetails  } = req.body;
    if([taskName,taskDetails].some((feild)=> feild.trim()==="" || !feild   ))
    {
      throw new ApiError(400,"Please provide all the feilds");
    }
   const task = await Task.create({
    userId,
    taskName,
    taskDetails
   });

  if(!task)
  {
    throw new ApiError(400,"Sorry something went wrong while creating the task")
  }
   

  return res.status(202)
  .json(
    new ApiResponse(200,task,"The task has been created successfully")
  )
})
const updateTask = asyncHandler(async(req,res)=>{

  const taskId = req.params.taskId;
  
  if(!taskId)
  {
    throw new ApiError(400,"Task Id is required")
  }

   
 const { newTaskName,newTaskDetails} = req.body;


 if(!newTaskName && !newTaskDetails)
 {
  throw new ApiError(200,"There is nothing to update");

 }

  const task = await Task.findByIdAndUpdate(taskId,{
    $set:{
      taskName:newTaskName,
      taskDetails:newTaskDetails
    }
  },{
    new:true,
    runValidators:true

  })

  if(!task)
  {
    throw new ApiError(400,"No task exists")
  }


 
  return res.status(202).json(
     new ApiResponse(202,task,"Task has been updated successfully")
  )



})
const updateTaskStatus = asyncHandler(async(req,res)=>{


  const taskId = req.params.taskId;
 
    if(!taskId)
  {
    throw new ApiError(400,"Task Id is required")
  }

  const {taskStatus} = req.body;


  if(taskStatus.trim()==="" || !taskStatus)
  {
    throw new ApiError(400,"No status found  for updation")
  }

  const task = await Task.findByIdAndUpdate(taskId,{
    $set:{
      taskStatus
    }
  },{
    new:true,
  
  });




  if(!task)
  {
    throw new ApiError(400,"No task exists")
  }


 
  return res.status(202).json(
     new ApiResponse(202,task,"Task status updated successfully")
  )




})
const  getTaskStatus = asyncHandler(async(req,res)=>{

  const taskId = req.params.taskId;

      if(!taskId)
  {
    throw new ApiError(400,"Task Id is required")
  }

  const task = await Task.findById(taskId).lean();

 if(!task)
 {
  throw new ApiError(400,"Sorry no task has been found")
 }
 

 return res.status(200).json(
  new ApiResponse(200,task.taskStatus,"Task status fetched successfully")
 )
})


export {
  createTask,
  updateTask,
  updateTaskStatus,
  getTaskStatus
}