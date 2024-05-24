import { orderService } from "../repositories/index.js";
import { logger } from "../utils/logger.js";

class OrdersController {
  constructor() {
    this.service = orderService;
  }

  getOrders = async (req, res) => {
    try {
      const result = await this.service.getOrders();
      res.json(result);
    } catch (error) {
      logger.error(error);
    }
  };

  getOrder = async (req, res) => {
    try {
      const { oid } = req.params;
      const order = await this.service.getOrderById(oid);

      if (!order) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }

      res.render("ticket", {
        productsWithTitles,
        style: "index.css",
      });
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  };

  createOrder = async (ticketData) => {
    try {
      const { purchaser, products, total, date } = ticketData;
      const order = await this.service.createOrder({
        purchaser,
        products,
        total,
        created: date,
      });
      res.status(201).json(order);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateOrder = async (req, res) => {
    try {
      const result = await this.service.updateOrder(oid, req.body);
      res.json(result);
    } catch (error) {
      logger.error(error);
    }
  };

  deleteOrder = async (req, res) => {
    try {
      const result = await this.service.deleteOrder(oid);
      res.json(result);
    } catch (error) {
      logger.error(error);
    }
  };
}

export default OrdersController;
