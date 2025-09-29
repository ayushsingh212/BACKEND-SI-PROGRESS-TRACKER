import { options } from "../constants.js";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse.js"



const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { refreshToken, accessToken };
};



const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }



  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const isExistingUser = await User.findOne({
    email
  });
  if (isExistingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({ fullName, email, password, });



  const userSafe = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, userSafe, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {


  const { email, password } = req.body;

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }
  if (!password || password.trim() === "") {
    throw new ApiError(400, "The  password is necessary feild");
  }


  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "The user does not exist, Please Register first");
  }

  const passwordCorrect = await user.isPasswordCorrect(user.password);


  if (!passwordCorrect) {
    throw new ApiError(401, "Sorry the password is incorrect! Please try again")
  }
  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);
  const userSafe = await User.findById(user._id).select("-password -refreshToken");
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, userSafe, "Login successful"));

})
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  await User.findByIdAndUpdate(userId, { refreshToken: undefined });

  return res
    .status(202)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(400, "Refresh token missing");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.refreshToken !== token) {
    throw new ApiError(403, "Refresh token mismatch");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "Token refreshed"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const id = req.user?._id;
  if (newPassword !== confirmNewPassword)
    throw new ApiError(400, "The entered password are not matching");

  const user = User.findById(id);

  if (!user.isPasswordCorrect(oldPassword)) {
    throw new ApiError(400, "Password is incorrect! Please try again");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(202)
    .json(new ApiResponse(200, {}, "Password has been changed successfully"));
});
const updateDetails = asyncHandler(async (req, res) => {

  const { newName } = req.body;

  if (!newName || newName.trim === "") {
    throw new ApiError(400, "The new name cannot be empty");
  }

  const user = User.findByIdAndUpdate(req.user?._id, {
    $set: {
      fullName: newName
    },

  },
    {
      new: true,
      runValidators: true,

    }
  ).select("-password -refreshToken")

  if(!user)
  {
    throw new ApiError(400,"Sorry user does not exist")
  }

  return res.status(200).json(
    new ApiResponse(200,user,"The name has been updated successfully")
  )

})