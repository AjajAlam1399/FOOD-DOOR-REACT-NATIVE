import { BookMark } from '../models/Bookmark.js'
import CatchAsyncError from "../middleware/CatchAsyncError.js";



export const CreateBookMark = CatchAsyncError(
    async (reqs, resp, next) => {
        const { email, resturantId } = reqs.body;
        let data = await BookMark.create({ email, resturantId })
        if (data) {
            data = await BookMark.find({ email }).populate('resturantId');
        }

        resp.status(200).json({
            sucess: true,
            data
        })
    }
)

export const deleteBookMark = CatchAsyncError(
    async (reqs, resp, next) => {
        const { email, resturantId } = reqs.body;
        let data = await BookMark.deleteOne({ email, resturantId })
        if (data) {
            data = await BookMark.find({ email }).populate('resturantId');
        }

        resp.status(200).json({
            sucess: true,
            data
        })
    }
)

export const getBookMark = CatchAsyncError(
    async (reqs, resp, next) => {
        const { email } = reqs.body;
        const data = await BookMark.find({ email }).populate('resturantId');

        resp.status(200).json({
            sucess: true,
            data
        })
    }
)
