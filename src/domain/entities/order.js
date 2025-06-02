const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/db').sequelize;

const ORDER_STATUS = {
  PENDIENTE: 'pendiente',
  LISTA_PAGO: 'lista_para_pago',
  SIN_STOCK: 'sin_stock',
  PAGADA: 'pagada',
  FALLA_PAGO: 'fallo_pago',
  ACEPTADA: 'aceptada',
  PREPARANDO: 'preparando',
  LISTA_PARA_ENTREGAR: 'lista_para_entregar',
  EN_CAMINO: 'en_camino',
  ENTREGADA: 'entregada',
  CANCELADA: 'cancelada',
  RECHAZADA: 'rechazada',
  FALLIDA: 'fallida',
  REEMBOLSADA: 'reembolsada',
  REPROGRAMADA: 'reprogramada'
};

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dealer_id: { // Nuevo campo
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: { // Nuevo campo
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      ORDER_STATUS.PENDIENTE,
      ORDER_STATUS.LISTA_PAGO,
      ORDER_STATUS.FALLA_PAGO,
      ORDER_STATUS.SIN_STOCK,
      ORDER_STATUS.PAGADA,
      ORDER_STATUS.ACEPTADA,
      ORDER_STATUS.PREPARANDO,
      ORDER_STATUS.LISTA_PARA_ENTREGAR,
      ORDER_STATUS.EN_CAMINO,
      ORDER_STATUS.ENTREGADA,
      ORDER_STATUS.CANCELADA,
      ORDER_STATUS.RECHAZADA,
      ORDER_STATUS.FALLIDA,
      ORDER_STATUS.REEMBOLSADA,
      ORDER_STATUS.REPROGRAMADA
    ),
    allowNull: false,
    defaultValue: ORDER_STATUS.PENDIENTE
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = { Order, ORDER_STATUS };