import { Schema, model } from "mongoose";

const orderCollection = "orders";

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
  },
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

const ordersModel = model(orderCollection, orderSchema);

export default ordersModel;
