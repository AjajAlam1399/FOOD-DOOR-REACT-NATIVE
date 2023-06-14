import mongoose from 'mongoose'

const bookMarkSchema=new mongoose.Schema({
    email:String,
    resturantId:String
})

export const BookMark=new mongoose.model("Bookmark",bookMarkSchema);