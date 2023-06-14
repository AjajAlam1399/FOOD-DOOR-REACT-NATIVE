import mongoose from 'mongoose'

const bookMarkSchema=new mongoose.Schema({
    email:String,
    resturantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Resturants'
    }
})

export const BookMark=new mongoose.model("Bookmark",bookMarkSchema);