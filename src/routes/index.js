import userRoutes from "./user.routes.js";
import taskRoutes from "./task.routes.js"
import { Router } from "express";

const router = Router();


router.use("/user",userRoutes);
router.use("/task",taskRoutes)






export default router;




