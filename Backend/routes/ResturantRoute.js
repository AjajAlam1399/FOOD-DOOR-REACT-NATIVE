import express from 'express'
import { foodItems, getAllResturant, getFoodById, getResturantById, newResturant } from '../controllers/ResturantController.js';
import { isAuthenticatedUser } from '../middleware/Auth.js';



const resturantRrouter=express.Router();

resturantRrouter.route('/new/resturant').post(newResturant);
resturantRrouter.route('/resturants').get(getAllResturant);

resturantRrouter.route('/food/new').post(foodItems);

resturantRrouter.route('/resturant').post(getResturantById)
resturantRrouter.route('/food/:id').get(getFoodById)

export default resturantRrouter;