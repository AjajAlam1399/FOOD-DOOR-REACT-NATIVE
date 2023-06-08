import { Schema, model } from 'mongoose';

const resturantSchemas = new Schema({
    name: {
        type: String,
        required: [true, "Please Enter the Resturent Name"],
        trim: true,
        maxLength: [30, "Name Should not Contain more than 30 chracter"],
        minlength: [2, "Name should contain at least 4 chrater"]
    },
    Types: {
        type: String,
        default: "Take-Away",
    },
    tag: [
        {
            type: String,
            required: [true, "Please mention the Food-Tags for this resturent"]
        }
    ],
    location: {
        type: String,
        required: [true, "Please Enter the Resturent Location"],
    },
    logo: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    poster: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    rating: {
        type: Number,
        required: [true, "Please Enter the Resturant Rating"]
    },
    noReviews: {
        type: Number,
    },
    cover: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    items: [
        {
            name: String,
            price: Number,
            public_id: String,
            url: String,
            description: String,
            ingredients: String,
            category: String
        }
    ],
    catogeries: [
        {
            type: String,
            required: [true, "Please Enter the Resturent Catogeries"]
        }
    ],
    distance: {
        type: String
    }
});

export const Resturant = new model("Resturants", resturantSchemas);

