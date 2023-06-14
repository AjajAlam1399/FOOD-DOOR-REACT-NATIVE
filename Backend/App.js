import express, { urlencoded } from "express";
import cors from "cors";
import router from "./routes/UserRouter.js";
import resturantRrouter from "./routes/ResturantRoute.js";
import cartRouter from "./routes/CartRoute.js";
import ErrorMiddleware from "./middleware/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import fileupload from 'express-fileupload'
import bookMarkRoute from "./routes/BookmarkRoute.js";
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
App.use('/api/v1',cartRouter);
App.use('/api/v1',bookMarkRoute);

// error handller middlewrae
App.use(ErrorMiddleware);

export default App;
