import CatchAsyncError from "../middleware/CatchAsyncError.js";
import { Resturant } from '../models/Resturantmodel.js'
import ErrorHanddler from "../utils/ErrorHanddler.js";
import fs from 'fs'
import cloudinary from 'cloudinary'

import {Food} from '../models/Food.js'

export const newResturant = CatchAsyncError(
    async (reqs, resp, next) => {
        const { name, tag, location, catogeries, rating, noReviews, distance } = reqs.body;

        let { logo, poster, cover } = reqs.files;

        if (!name || !tag || !location || !logo || !poster || !cover || !catogeries ||
            !rating || !noReviews || !distance) {
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
            rating,
            noReviews,
            distance,
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
            message: "Resturant has been sucessfully added.",
            restuant
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

// Adding Food

export const foodItems = CatchAsyncError(
    async (reqs, resp, next) => {
        const _id = reqs.params.id;

        const { name, price, description, ingredients, category,resturant_id } = reqs.body;

        let image = reqs.files.image.tempFilePath;

        const mycloud1 = await cloudinary.v2.uploader.upload(image, {
            folder: "Food-Door"
        })

        // removing file
        fs.rmSync("tmp", { recursive: true });

        const food=await Food.create({
            name,
            price,
            public_id: mycloud1.public_id,
            url: mycloud1.secure_url, description, ingredients,
            category,
            resturant_id
        })

        resp.status(200).json({
            sucess: true,
            message: "Item has been sucessfully added",
            food
        })
    }
);

// 
export const getResturantById = CatchAsyncError(
    async (reqs, resp, next) => {
        const { id } = reqs.body;

        const data = await Resturant.aggregate([
            {
                $match: { id }
            },
            {
                '$lookup': {
                    'from': 'Food',
                    'localField': 'id',
                    'foreignField': 'resturant_id',
                    'as': 'foods'
                }
            }

        ])

        resp.status(200).json({
            sucess: true,
            data
        })
    }
)