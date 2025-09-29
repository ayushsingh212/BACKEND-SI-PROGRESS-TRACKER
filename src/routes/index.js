import userRoutes from "./user.routes.js";

import { Router } from "express";

const router = Router();


router.use("/user",userRoutes);






export default router;




