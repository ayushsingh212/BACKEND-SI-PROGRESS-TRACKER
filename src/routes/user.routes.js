import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, refreshAccessToken, registerUser, updateDetails } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refreshToken", refreshAccessToken);
router.get("/getUser", verifyJWT, getCurrentUser);
router.put("/changePassword", verifyJWT, changeCurrentPassword);
router.put("/updateDetails", verifyJWT, updateDetails);
export default router;

