const { body, query, param } = require('express-validator');
const { ORDER_STATUS } = require('../domain/entities/order'); // Asegúrate de exportar ORDER_STATUS en order.js

const createOrderValidator = [
  body('orderData.user_id')
    .isInt().withMessage('user_id debe ser un número entero'),
  body('orderData.store_id')
    .isInt().withMessage('store_id debe ser un número entero'),
  body('orderData.dealer_id')
    .isInt().withMessage('dealer_id debe ser un número entero'),
  body('orderData.address')
    .isString().notEmpty().withMessage('address es requerido'),
  body('items')
    .isArray({ min: 1 }).withMessage('items debe ser un arreglo con al menos un producto'),
  body('items.*.product_id')
    .isInt().withMessage('Cada item debe tener un product_id entero'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Cada item debe tener una cantidad mayor a 0'),
  body('items.*.unit_price')
    .isFloat({ gt: 0 }).withMessage('Cada item debe tener un unit_price mayor a 0'),
  body('orderData.status')
    .optional()
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(`status debe ser uno de: ${Object.values(ORDER_STATUS).join(', ')}`),
  body('payment_method')
    .exists().withMessage('payment_method es requerido')
    .isString().withMessage('payment_method debe ser un string')
    .isIn(['tarjeta', 'pse', 'efectivo']).withMessage('payment_method debe ser tarjeta, pse o efectivo')
];

const getOrderByIdValidator = [
  param('id').isInt().withMessage('El id debe ser un número entero'),
];

const updateOrderValidator = [
  param('id').isInt().withMessage('El id debe ser un número entero'),
  body('user_id').optional().isInt().withMessage('user_id debe ser un número entero'),
  body('store_id').optional().isInt().withMessage('store_id debe ser un número entero'),
  body('dealer_id').optional().isInt().withMessage('dealer_id debe ser un número entero'),
  body('address').optional().isString().withMessage('address debe ser un string'),
  body('status')
    .optional()
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(`status debe ser uno de: ${Object.values(ORDER_STATUS).join(', ')}`),
  body('total_amount').optional().isDecimal().withMessage('total_amount debe ser decimal'),
  body('created_at').optional().isISO8601().withMessage('created_at debe ser una fecha válida'),
  body('updated_at').optional().isISO8601().withMessage('updated_at debe ser una fecha válida'),
];

const addItemsValidator = [
  param('id').isInt().withMessage('El id debe ser un número entero'),
  body().isArray({ min: 1 }).withMessage('El body debe ser un arreglo con al menos un producto'),
  body('*.product_id').isInt().withMessage('Cada item debe tener un product_id entero'),
  body('*.quantity').isInt({ min: 1 }).withMessage('Cada item debe tener una cantidad mayor a 0'),
  body('*.unit_price').isFloat({ gt: 0 }).withMessage('Cada item debe tener un unit_price mayor a 0'),
];

const removeItemValidator = [
  param('id').isInt().withMessage('El id debe ser un número entero'),
  param('itemId').isInt().withMessage('El itemId debe ser un número entero'),
];

const cancelOrderValidator = [
  param('id').isInt().withMessage('El id debe ser un número entero'),
];

const getOrdersByFilterValidator = [
  query('id').optional().isInt().withMessage('id debe ser un número entero'),
  query('user_id').optional().isInt().withMessage('user_id debe ser un número entero'),
  query('store_id').optional().isInt().withMessage('store_id debe ser un número entero'),
  query('dealer_id').optional().isInt().withMessage('dealer_id debe ser un número entero'),
  query('status')
    .optional()
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(`status debe ser uno de: ${Object.values(ORDER_STATUS).join(', ')}`),
  query('address').optional().isString().withMessage('address debe ser un string'),
  query('total_amount').optional().isDecimal().withMessage('total_amount debe ser decimal'),
  query('created_at').optional().isISO8601().withMessage('created_at debe ser una fecha válida'),
  query('updated_at').optional().isISO8601().withMessage('updated_at debe ser una fecha válida'),
];

module.exports = {
  createOrderValidator,
  getOrderByIdValidator,
  updateOrderValidator,
  addItemsValidator,
  removeItemValidator,
  cancelOrderValidator,
  getOrdersByFilterValidator,
};