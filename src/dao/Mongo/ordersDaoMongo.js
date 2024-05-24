import ordersModel from "./models/orders.models.js";

class OrdersDaoMongo {
  constructor() {
    this.ordersModel = ordersModel;
  }

  async get() {
    return await this.ordersModel.find({});
  }

  async getById(oid) {
    return await this.ordersModel.findById(oid).populate("products.product") 
  }

  async create(ticketData) {
    return await this.ordersModel.create(ticketData);
  }

  async update(oid, order) {
    return await this.ordersModel.updateOne({ _id: oid }, order);
  }

  async delete(oid) {
    return await this.ordersModel.deleteOne({ _id: oid });
  }
}
export default OrdersDaoMongo;
