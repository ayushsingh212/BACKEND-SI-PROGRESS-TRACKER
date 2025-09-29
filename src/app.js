import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"



const app = express();


app.use(cors({
  origin:process.env.FRONTEND_URL
}))
app.use(urlencoded({
  extended:true,
  limit:"1mb"
}));
app.use(express.urlencoded({
  extended:true,
  limit:"1mb"
}));
app.use(cookieParser());









export default app;