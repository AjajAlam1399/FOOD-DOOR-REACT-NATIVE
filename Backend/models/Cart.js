import mongoose from 'mongoose'

const cartSchemas = new mongoose.Schema({
    email: String,
    foodId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'foods'
    },
    count: Number
})

export const Cart = new mongoose.model("Cart", cartSchemas);

