import { config } from "dotenv";
import App from "./App.js";
import cloudinary from 'cloudinary';

import { connectDataBase } from "./config/database.js";

// uncaught exceptoion
process.on("uncaughtException", (err) => {
  console.log(`Error :${err}`);
  console.log("Server is close due to uncaught exception");
  process.exit(1);
});


// dotenv config
config({ path: "Backend/config/config.env" });

//database config
connectDataBase();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})



const server = App.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is live on PORT:${process.env.PORT}`);
  }
});

// unhandeled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err}`);
  console.log("Server is closed due to unhandeled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
