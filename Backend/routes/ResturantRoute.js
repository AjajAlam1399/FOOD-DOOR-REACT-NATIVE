import express from 'express'
import { getAllResturant, newResturant } from '../controllers/ResturantController.js';
import { isAuthenticatedUser } from '../middleware/Auth.js';



const resturantRrouter=express.Router();

resturantRrouter.route('/new/resturant').post(newResturant);
resturantRrouter.route('/resturants').get(getAllResturant);

export default resturantRrouter;