import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import CartController from "../controllers/carts.controller.js";

const cartsRouter = Router();

const {
  createCart,
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  removeAllFromCart
} = new CartController();

cartsRouter.post("/", createCart);

cartsRouter.post("/add", passportCall(['jwt', 'github']), addToCart );

cartsRouter.get("/cart", passportCall(['jwt', 'github']), getCart);

cartsRouter.put("/:productId", passportCall(['jwt', 'github']), updateCart);

cartsRouter.delete('/errase/:productId', passportCall(['jwt', 'github']), removeFromCart);

cartsRouter.delete('/vaciar', passportCall(['jwt', 'github']), removeAllFromCart);

export default cartsRouter;
