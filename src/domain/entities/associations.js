const { Order } = require('./order');
const OrderItem = require('./order_item');
const OrderStatusHistory = require('./order_status_history');

// Relación: Order tiene muchos OrderItems
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Relación: Order tiene muchos OrderStatusHistory
Order.hasMany(OrderStatusHistory, { foreignKey: 'order_id', as: 'statusHistory' });
OrderStatusHistory.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = { Order, OrderItem, OrderStatusHistory };