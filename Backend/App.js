import express, { urlencoded } from "express";
import cors from "cors";
import router from "./routes/UserRouter.js";
import resturantRrouter from "./routes/ResturantRoute.js";
import ErrorMiddleware from "./middleware/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import fileupload from 'express-fileupload'
const App = express();

App.use(express.json());
App.use(express.urlencoded({extended:true}));
App.use(cookieParser());

App.use(
    fileupload({
        limits:{fileSize:50*1024*1024},
        useTempFiles:true
    })
)

App.use(cors());


// uder Router
App.use("/api/v1", router);
App.use('/api/v1',resturantRrouter);

// error handller middlewrae
App.use(ErrorMiddleware);

export default App;
