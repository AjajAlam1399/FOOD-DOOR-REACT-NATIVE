import express from "express";
import { CreateBookMark, deleteBookMark, getBookMark } from "../controllers/BookmarkControllers.js";
const bookMarkRoute = express.Router();

bookMarkRoute.route('/new/bookmark').post(CreateBookMark);
bookMarkRoute.route('/delete/bookmark').delete(deleteBookMark);
bookMarkRoute.route('/bookmark').post(getBookMark);

export default bookMarkRoute;