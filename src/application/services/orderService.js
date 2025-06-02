const QueueManager = require('@oerazoo/commons-ms').QueueManager;
const logger = require('../../utils/Logger');

// Configuración de la base de datos para la cola (ajusta según tu entorno)
const queueConfig = {
  user: process.env.QUEUE_DB_USER || '',
  host: process.env.QUEUE_DB_HOST || '',
  database: process.env.QUEUE_DB_NAME || '',
  password: process.env.QUEUE_DB_PASSWORD || '',
  port: process.env.QUEUE_DB_PORT ? parseInt(process.env.QUEUE_DB_PORT) : 5434
};

// Instancia única de QueueManager
const queueManager = new QueueManager(queueConfig);

class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  // Crear una nueva orden
  async createOrder(orderData, items, payment_method) {
    try {
      logger.info(`Creando orden con datos: ${JSON.stringify(orderData)} e items: ${JSON.stringify(items)} y payment_method: ${payment_method}`);
      // 1. Crear la orden y los items en la base de datos
      const order = await this.orderRepository.create(orderData, items);

      // Calcular el total del pedido sumando (cantidad * unit_price) de cada item
      const total = items.reduce(
        (sum, item) => sum + (item.quantity * item.unit_price),
        0
      );

      // 2. Publicar mensaje en la cola para la saga
      await queueManager.enqueue(
        'reserve_inventory',
        { 
          orderId: order.id,
          items,
          store_id: order.store_id,
          user_id: order.user_id,
          total,
          payment_method // Incluye el método de pago en el mensaje de la cola
        }
      );

      logger.info(`Mensaje encolado para saga: reserve_inventory para la orden ${order.id}`);
      return order;
    } catch (error) {
      logger.error(`Error al crear orden: ${error.message}`);
      throw error;
    }
  }

  // Consultar una orden por ID
  async getOrderById(orderId) {
    try {
      return await this.orderRepository.findById(orderId);
    } catch (error) {
      console.log(error);
      logger.error(`Error al consultar la orden con ID ${orderId}: ${error.message}`);
      throw error;
    }
  }

  // Actualizar una orden
  async updateOrder(orderId, updateData) {
    try {
      // Obtener la orden actual antes de actualizar
      const currentOrder = await this.orderRepository.findById(orderId);
      if (!currentOrder) {
        throw new Error('Orden no encontrada');
      }

      // Actualizar la orden
      const updatedOrder = await this.orderRepository.update(orderId, updateData);

      // Si se actualizó el status, guardar el historial
      if (updateData.status && updateData.status !== currentOrder.status) {
        await this.orderRepository.OrderStatusHistory.create({
          order_id: orderId,
          status: updateData.status
        });
      }

      return updatedOrder;
    } catch (error) {
      logger.error(`Error al actualizar la orden con ID ${orderId}: ${error.message}`);
      throw error;
    }
  }

  // Agregar productos a una orden y recalcular el total
  async addItemsToOrder(orderId, items) {
    try {
      if (!Array.isArray(items) || items.some(item => typeof item.unit_price !== 'number')) {
        throw new Error('Cada item debe incluir el atributo unit_price (número).');
      }
      // Agrega los nuevos items
      await this.orderRepository.addItems(orderId, items);

      // Obtiene todos los items actuales de la orden para recalcular el total
      const order = await this.orderRepository.findById(orderId);
      const allItems = order.items || [];

      const newTotalAmount = allItems.reduce(
        (sum, item) => sum + (item.unit_price * item.quantity),
        0
      );

      // Actualiza el total_amount de la orden
      await this.orderRepository.update(orderId, { total_amount: newTotalAmount });

      // Retorna la orden actualizada
      return await this.orderRepository.findById(orderId);
    } catch (error) {
      logger.error(`Error al agregar productos a la orden con ID ${orderId}: ${error.message}`);
      throw error;
    }
  }

  // Eliminar un producto de una orden y recalcular el total
  async removeItemFromOrder(orderId, itemId) {
    try {
      // Elimina el item
      await this.orderRepository.removeItem(orderId, itemId);

      // Obtiene todos los items actuales de la orden para recalcular el total
      const order = await this.orderRepository.findById(orderId);
      const allItems = order.items || [];

      const newTotalAmount = allItems.reduce(
        (sum, item) => sum + (item.unit_price * item.quantity),
        0
      );

      // Actualiza el total_amount de la orden
      await this.orderRepository.update(orderId, { total_amount: newTotalAmount });

      // Retorna la orden actualizada
      return await this.orderRepository.findById(orderId);
    } catch (error) {
      logger.error(`Error al eliminar el producto con ID ${itemId} de la orden con ID ${orderId}: ${error.message}`);
      throw error;
    }
  }

  // Cancelar una orden
  async cancelOrder(orderId) {
    try {
      return await this.orderRepository.cancel(orderId);
    } catch (error) {
      logger.error(`Error al cancelar la orden con ID ${orderId}: ${error.message}`);
      throw error;
    }
  }

  // Obtener órdenes por filtros
  async getOrdersByFilter(filters) {
    try {
      return await this.orderRepository.findByFilter(filters);
    } catch (error) {
      logger.error(`Error al consultar órdenes por filtro: ${error.message}`);
      throw error;
    }
  }
}

module.exports = OrderService;