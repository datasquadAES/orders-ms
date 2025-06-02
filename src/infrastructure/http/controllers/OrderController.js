class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  // Crear una nueva orden
  async create(req, res) {
    try {
      const { orderData, items, payment_method } = req.body;
      const order = await this.orderService.createOrder(orderData, items, payment_method);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Consultar una orden por ID
  async getById(req, res) {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Actualizar una orden
  async update(req, res) {
    try {
      const order = await this.orderService.updateOrder(req.params.id, req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Agregar productos a una orden
  async addItems(req, res) {
    try {
      const items = req.body; // Aquí el body es el array directamente
      const result = await this.orderService.addItemsToOrder(req.params.id, items);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar un producto de una orden
  async removeItem(req, res) {
    try {
      const { itemId } = req.params;
      const result = await this.orderService.removeItemFromOrder(req.params.id, itemId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cancelar una orden
  async cancel(req, res) {
    try {
      const order = await this.orderService.cancelOrder(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener órdenes por filtros
  async getByFilter(req, res) {
    try {
      const filters = req.query;
      console.log(filters);
      const orders = await this.orderService.getOrdersByFilter(filters);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController;