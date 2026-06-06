// @ts-check
const { Sequelize, DataTypes } = require('sequelize')

/**
 * LOT® Mail — in-app asynchronous messaging.
 * Composed via /email command in Log, delivered to Sync.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('lot_mails', {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      recipientName: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    })

    await queryInterface.addIndex('lot_mails', ['receiverId', 'isRead', 'createdAt'], {
      name: 'idx_lot_mails_receiver_read',
    })
    await queryInterface.addIndex('lot_mails', ['senderId', 'createdAt'], {
      name: 'idx_lot_mails_sender',
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_mails')
  },
}
