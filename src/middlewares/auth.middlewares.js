import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {

  const token = req.cookies?.accessToken

  if (!token) {
    throw new ApiError(400, "Sorry the token has not been found")
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select("-password -refreshToken");


  if (!user) {
    throw new ApiError(400, "Sorry! No user exists")
  }
  req.user = user;

  next();

})