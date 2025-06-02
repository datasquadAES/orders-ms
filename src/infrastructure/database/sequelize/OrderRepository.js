class SequelizeOrderRepository {
  constructor(OrderModel, OrderItemModel, OrderStatusHistoryModel) {
    this.Order = OrderModel;
    this.OrderItem = OrderItemModel;
    this.OrderStatusHistory = OrderStatusHistoryModel;
  }

  // Crear una nueva orden
  async create(orderData, items) {
    // orderData ya incluye total_amount calculado desde el servicio
    const order = await this.Order.create(orderData);
    let createdItems = [];
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        ...item,
        order_id: order.id,
        unit_price: item.unit_price
        // No incluyas total_price si la columna es generada en la base de datos
      }));
      createdItems = await this.OrderItem.bulkCreate(orderItems, { returning: true });
    }
    const orderJson = order.toJSON();
    orderJson.items = createdItems.map(item => item.toJSON());
    return orderJson;
  }

  // Consultar una orden por ID
  async findById(orderId) {
    const order = await this.Order.findByPk(orderId, {
      include: [
        { model: this.OrderItem, as: 'items' },
        { model: this.OrderStatusHistory, as: 'statusHistory' }
      ]
    });
    if (!order) throw new Error('Order not found');
    return order.toJSON();
  }

  // Actualizar datos de una orden
  async update(orderId, updateData) {
    const order = await this.Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    await order.update(updateData);
    return order.toJSON();
  }

  // Agregar productos a una orden
  async addItems(orderId, items) {
    const order = await this.Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderId,
      unit_price: item.unit_price
    }));
    await this.OrderItem.bulkCreate(orderItems);
    return { message: 'Items added successfully' };
  }

  // Eliminar productos de una orden
  async removeItem(orderId, itemId) {
    const item = await this.OrderItem.findOne({ where: { id: itemId, order_id: orderId } });
    if (!item) throw new Error('Item not found');
    await item.destroy();
    return { message: 'Item removed successfully' };
  }

  // Cancelar una orden
  async cancel(orderId) {
    const order = await this.Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    await order.update({ status: 'cancelled' });
    await this.OrderStatusHistory.create({ order_id: orderId, status: 'cancelled' });
    return order.toJSON();
  }

  // Buscar órdenes por filtros dinámicos
  async findByFilter(filters) {
    const where = {};
    // Solo agrega filtros si están presentes
    if (filters.id) where.id = filters.id;
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.store_id) where.store_id = filters.store_id;
    if (filters.dealer_id) where.dealer_id = filters.dealer_id;
    if (filters.status) where.status = filters.status;
    if (filters.address) where.address = filters.address;
    if (filters.total_amount) where.total_amount = filters.total_amount;
    if (filters.created_at) where.created_at = filters.created_at;
    if (filters.updated_at) where.updated_at = filters.updated_at;

    const orders = await this.Order.findAll({
      where,
      include: [
        { model: this.OrderItem, as: 'items' },
        { model: this.OrderStatusHistory, as: 'statusHistory' }
      ]
    });
    return orders.map(order => order.toJSON());
  }
}

module.exports = SequelizeOrderRepository;