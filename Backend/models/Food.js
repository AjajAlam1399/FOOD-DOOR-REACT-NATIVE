import { Schema, model } from 'mongoose'


const foodSchemas = new Schema({
    name: String,
    price: Number,
    public_id: String,
    url: String,
    description: String,
    ingredients: String,
    category: String
});

export const Food=new model("Food",foodSchemas);