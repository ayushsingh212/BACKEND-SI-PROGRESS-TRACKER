import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createTask, getTaskStatus, updateTask, updateTaskStatus } from "../controllers/task.controllers.js";

const router = Router();

router.use(verifyJWT);

router.post("/createTask", createTask);
router.put("/updateTask/:taskId", updateTask);
router.patch("/updateTaskStatus/:taskId", updateTaskStatus);
router.get("/getTaskStatus/:taskId", getTaskStatus);



export default router;