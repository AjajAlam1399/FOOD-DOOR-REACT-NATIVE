import CatchAsyncError from "../middleware/CatchAsyncError.js";
import { Resturant } from '../models/Resturantmodel.js'
import ErrorHanddler from "../utils/ErrorHanddler.js";
import fs from 'fs'
import cloudinary from 'cloudinary'


export const newResturant = CatchAsyncError(
    async (reqs, resp, next) => {
        const { name, tag, location, catogeries } = reqs.body;

        let { logo, poster, cover } = reqs.files;

        if (!name || !tag || !location || !logo || !poster || !cover || !catogeries) {
            return next(new ErrorHanddler("Please Enter All the Required Field", 400));
        }
        let restuant = await Resturant.findOne({ name });
        if (restuant) {
            return next(new ErrorHanddler("Resturant is Already Exist", 401));
        }

        logo = reqs.files.logo.tempFilePath;
        poster = reqs.files.poster.tempFilePath;
        cover = reqs.files.cover.tempFilePath;

        const mycloud1 = await cloudinary.v2.uploader.upload(logo, {
            folder: "Food-Door"
        })
        const mycloud2 = await cloudinary.v2.uploader.upload(poster, {
            folder: "Food-Door"
        })
        const mycloud3 = await cloudinary.v2.uploader.upload(cover, {
            folder: "Food-Door"
        })

        //deleting temp file
        fs.rmSync("tmp", { recursive: true });

        restuant = await Resturant.create({
            name,
            tag,
            location,
            logo: {
                public_id: mycloud1.public_id,
                url: mycloud1.secure_url,
            },
            poster: {
                public_id: mycloud2.public_id,
                url: mycloud2.secure_url,
            },
            cover: {
                public_id: mycloud3.public_id,
                url: mycloud3.secure_url,
            }
            , catogeries

        })

        resp.status(200).json({
            sucess: true,
            message: "Resturant has been sucessfully added."
        })
    }
)

export const getAllResturant = CatchAsyncError(
    async (reqs, resp, next) => {
        const data = await Resturant.find();
        resp.status(200).json({
            sucess: true,
            data
        })
    }
)