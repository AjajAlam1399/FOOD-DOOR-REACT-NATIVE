import express from "express";
import { addToCart, cartItems, removeFromCart } from "../controllers/CartControllers.js";
const cartRouter = express.Router();

cartRouter.route('/new/cart').put(addToCart);
cartRouter.route('/delete/cart').delete(removeFromCart);
cartRouter.route('/cart').post(cartItems);

export default cartRouter;