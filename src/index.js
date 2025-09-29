import dotenv from "dotenv";
import {connectDB} from "./dB/dB.connect.js";
import app from "./app.js";

dotenv.config({
  path: "../.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 1000, () => {
      console.log(`The server is running at the port : ${process.env.PORT}`);
    });
  })
  .catch((errr) => {
    console.log(
      "The error has been found in the connecting the databases",
      errr
    );
  });