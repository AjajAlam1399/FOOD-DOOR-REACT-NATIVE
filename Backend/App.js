import express from "express";
import cors from "cors";
import router from "./routes/UserRouter.js";
import ErrorMiddleware from "./middleware/ErrorMiddleware.js";
import cookieParser from "cookie-parser";

const App = express();

App.use(express.json());
App.use(cookieParser());

App.use(cors());


// uder Router
App.use("/api/v1", router);

// error handller middlewrae
App.use(ErrorMiddleware);

export default App;
