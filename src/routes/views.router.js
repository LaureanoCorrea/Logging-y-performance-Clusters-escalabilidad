import { Router } from "express";
import ViewController from "../controllers/views.controller.js";
import { passportCall } from "../middleware/passportCall.js";
import authorization from "../middleware/authentication.middleware.js";

const viewRouter = Router();
const viewController = new ViewController();

viewRouter.get("/", viewController.login);
viewRouter.get("/login", viewController.login);
viewRouter.get("/register", viewController.register);
viewRouter.get("/cart", passportCall(["jwt"]), viewController.cart);
viewRouter.get(
  "/chat",
  passportCall(["jwt"]),
  authorization(["user"]),
  viewController.chat
);
viewRouter.get(
  "/products",
  passportCall(["jwt"]),
  authorization(["admin", "user"]),
  viewController.products
);
viewRouter.get(
  "/realtimeproducts",
  passportCall(["jwt"]),
  authorization(["admin", "user"]),
  viewController.realtimeProducts
);

viewRouter.get(
  "/productDetails/:pid",
  passportCall(["jwt"]),
  viewController.productDetails
);
viewRouter.get(
  "/product-added/:pid",
  passportCall(["jwt"]),
  viewController.productAdded
);

viewRouter.get(
  "/current",
  passportCall(["jwt"]),
  authorization(["user", "admin"]),
  viewController.current
);

viewRouter.get(
  "/ticket/:oid", 
  passportCall(["jwt"]), 
  authorization(["user", "admin"]),
  viewController.ticket);

  viewRouter.get("/loggerTest", viewController.loggerTest);


export default viewRouter;
