import { Cart } from '../models/Cart.js';
import CatchAsyncError from "../middleware/CatchAsyncError.js";
// import ErrorHanddler from "../utils/ErrorHanddler.js";

// add food to cart
export const addToCart = CatchAsyncError(
    async (reqs, resp, next) => {
        const { foodId, email } = reqs.body;
        let cart = await Cart.updateOne(
            { foodId, email }, { $inc: { count: 1 } },
            { upsert: true }
        )
        let itemsTotal = 0;
        let discount = 0;
        if (cart?.acknowledged) {
            cart = await Cart.find({ email }).populate('foodId');
            itemsTotal = cart?.map(item => item?.foodId?.price * item?.count).reduce((a, b) => parseFloat(a) + parseFloat(b));
        }

        resp.status(200).json({
            sucess: true,
            data: {
                cart,
                metaData: {
                    itemsTotal,
                    discount,
                    grandTotal: itemsTotal - discount

                }
            }
        })
    }
)

// remove food from cart

export const removeFromCart = CatchAsyncError(

    async (reqs, resp, next) => {
        const { foodId, email } = reqs.body;
        let cart = await Cart.updateOne(
            { foodId, email }, { $inc: { count: -1 } },
            { upsert: true }
        )
        let itemsTotal = 0;
        let discount = 0;
        if (cart?.acknowledged) {
            cart = await Cart.find({ email }).populate('foodId');
            itemsTotal = cart?.map(item => item?.foodId?.price * item?.count).reduce((a, b) => parseFloat(a) + parseFloat(b));

        }
        resp.status(200).json({
            sucess: true,
            data: {
                cart,
                metaData: {
                    itemsTotal,
                    discount,
                    grandTotal: itemsTotal - discount

                }
            }
        })
    }
)

export const cartItems = CatchAsyncError(
    async (reqs, resp, next) => {
        const { email } = reqs.body;
        const cart = await Cart.find({ email }).populate('foodId');

        let itemsTotal = cart?.map(item => item?.foodId?.price * item?.count).reduce((a, b) => parseFloat(a) + parseFloat(b));
        let discount = 0;

        resp.status(200).json({
            sucess: true,
            data: {
                cart,
                metaData: {
                    itemsTotal,
                    discount,
                    grandTotal: itemsTotal - discount

                }
            }
        })
    }
)