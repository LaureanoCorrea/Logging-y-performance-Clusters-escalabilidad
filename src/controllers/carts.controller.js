import {
  cartService,
  productService,
  orderService,
} from "../repositories/index.js";
import { logger } from "../utils/logger.js";

class CartController {
  constructor() {
    this.cartService = cartService;
    this.productService = productService;
    this.orderService = orderService;
  }

  async createCart(req, res) {
    try {
      const { products } = req.body;
      const newCart = await this.cartService.create({ products });

      res.status(201).json({
        status: "success",
        message: 'Carrito agregado exitosamente "vacio"',
        cart: newCart,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async add(req, res) {
    try {
      const { pid, quantity } = req.body;
      const cid = req.user.cart;

      const cart = await this.cartService.addProduct(cid, pid, quantity);
      res.status(200).json({
        status: "success",
        message: "Producto agregado al carrito exitosamente",
        cart,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al agregar el producto al carrito",
      });
    }
  }

  async getCart(req, res) {
    try {
      const cid = req.user.cart;
      const cart = await this.cartService.getById(cid);

      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "El carrito especificado no existe",
        });
      }

      res.render("cart", {
        cid,
        cart,
        style: "index.css",
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async update(req, res) {
    try {
      const { pid } = req.params;
      const { quantity } = req.body;
      const cid = req.user.cart;

      const updatedCart = await this.cartService.update(cid, pid, quantity);

      res.status(200).json({
        status: "success",
        message: "Cantidad del producto actualizada exitosamente",
        updatedCart,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        status: "error",
        message:
          "Error interno del servidor al actualizar la cantidad del producto en el carrito",
      });
    }
  }

  async purchase(req, res) {
    const cid = req.user.cart;
    let total = 0;
    const buyedProducts = [];
    const nonStock = [];

    try {
      const cart = await this.cartService.getById(cid);

      if (!cart) {
        return res
          .status(404)
          .json({ status: "error", message: "Carrito no encontrado" });
      }

      // Verificar el stock
      for (const item of cart.products) {
        const pid = item.product._id;
        const quantity = item.quantity;
        // Obtener la información de stock
        const stockInfo = await this.productService.getById(pid);
        const stock = stockInfo.stock;

        if (quantity > stock) {
          nonStock.push({ productId: pid, quantity });
        } else {
          const newStock = stock - quantity;
          await this.productService.updateProductStock(pid, newStock);
          // Agregar el ID del producto a la lista de productos comprados
          buyedProducts.push({ product: pid, quantity });
          //Calcular el total
          const productPrice = stockInfo.price;
          total += productPrice * quantity;
        }
      }

      // Actualizar el carrito con los productos restantes
      const remainingProducts = cart.products.filter(
        (item) => !buyedProducts.some((bp) => bp.product === item.product._id)
      );

      await this.cartService.updateCart(cid, remainingProducts);

      const ticketData = {
        purchaser: req.user.first_name,
        products: buyedProducts,
        total: total.toFixed(2),
        date: new Date(),
      };

      const order = await this.orderService.createOrder(ticketData);

      return res.status(200).json({
        status: "success",
        message: "Compra completada exitosamente",
        order,
        nonStock,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al procesar la compra",
      });
    }
  }

  async removeFromCart(req, res) {
    const { pid } = req.params;
    const cid = req.user.cart;

    try {
      await this.cartService.deleteProduct(cid, pid);
      res.json({ message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
      logger.error(error);
    }
  }

  async removeAllFromCart(req, res) {
    const cid = req.user.cart;
    try {
      await this.cartService.deleteAll(cid);
      res.json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
      logger.error(error);
    }
  }
}

export default CartController;
