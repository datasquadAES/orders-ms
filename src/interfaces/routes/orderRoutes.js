const express = require('express');
const router = express.Router();
const OrderController = require('../../infrastructure/http/controllers/OrderController');
const OrderService = require('../../application/services/orderService');
const SequelizeOrderRepository = require('../../infrastructure/database/sequelize/OrderRepository');
const { Order, OrderItem, OrderStatusHistory } = require('../../domain/entities/associations');
const {
  createOrderValidator,
  getOrderByIdValidator,
  updateOrderValidator,
  addItemsValidator,
  removeItemValidator,
  cancelOrderValidator,
  getOrdersByFilterValidator,
} = require('../../middlewares/orderValidators');
const validate = require('../../middlewares/validate');

// Configuración de dependencias
const orderRepository = new SequelizeOrderRepository(Order, OrderItem, OrderStatusHistory);
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de órdenes
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderData:
 *                 type: object
 *                 properties:
 *                   user_id: { type: integer }
 *                   store_id: { type: integer }
 *                   dealer_id: { type: integer }
 *                   address: { type: string }
 *                   total_amount: { type: number }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id: { type: integer }
 *                     quantity: { type: integer }
 *                     unit_price: { type: number }
 *               payment_method:
 *                 type: string
 *                 enum: [tarjeta, pse, efectivo]
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/orders',
  createOrderValidator,
  validate,
  orderController.create.bind(orderController)
);

/**
 * @swagger
 * /orders/filter:
 *   get:
 *     summary: Obtener órdenes por filtros
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de la orden
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de usuario
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de tienda
 *       - in: query
 *         name: dealer_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de repartidor
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por estado de la orden
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Filtrar por dirección
 *       - in: query
 *         name: total_amount
 *         schema:
 *           type: number
 *         description: Filtrar por monto total
 *       - in: query
 *         name: created_at
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrar por fecha de creación
 *       - in: query
 *         name: updated_at
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrar por fecha de actualización
 *     responses:
 *       200:
 *         description: Lista de órdenes filtradas
 *       500:
 *         description: Error interno del servidor
 */
router.get('/orders/filter', getOrdersByFilterValidator, validate, orderController.getByFilter.bind(orderController));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Consultar una orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Detalles de la orden
 *       404:
 *         description: Orden no encontrada
 */
router.get('/orders/:id', getOrderByIdValidator, validate, orderController.getById.bind(orderController));

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Actualizar una orden
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Datos a actualizar
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.put('/orders/:id', updateOrderValidator, validate, orderController.update.bind(orderController));

/**
 * @swagger
 * /orders/{id}/items:
 *   post:
 *     summary: Agregar productos a una orden
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: integer
 *                   description: ID del producto
 *                 quantity:
 *                   type: integer
 *                   description: Cantidad del producto
 *                 unit_price:
 *                   type: number
 *                   format: float
 *                   description: Precio unitario del producto
 *               required:
 *                 - product_id
 *                 - quantity
 *                 - unit_price
 *               description: Productos a agregar
 *     responses:
 *       200:
 *         description: Productos agregados exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/orders/:id/items', addItemsValidator, validate, orderController.addItems.bind(orderController));

/**
 * @swagger
 * /orders/{id}/items/{itemId}:
 *   delete:
 *     summary: Eliminar un producto de una orden
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/orders/:id/items/:itemId', removeItemValidator, validate, orderController.removeItem.bind(orderController));

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancelar una orden
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden cancelada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/orders/:id/cancel', cancelOrderValidator, validate, orderController.cancel.bind(orderController));


/**
 * @swagger
 * /:
 *   get:
 *     summary: Verificar el estado del servicio
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: El servicio está funcionando
 */
router.get('/', (req, res) => {
  res.send('Orders service is running OK');
});

module.exports = router;