// @ts-check
'use strict'
const { DataTypes } = require('sequelize')

/**
 * LOT Mail — peer-to-peer messaging inside the LOT Community.
 * Compose via /email to [name] in Log; appears in Sync inbox.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('lot_mails', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('lot_mails', ['receiverId', 'isRead', 'createdAt'], {
      name: 'idx_lot_mails_receiver_unread',
    })

    await queryInterface.addIndex('lot_mails', ['senderId', 'createdAt'], {
      name: 'idx_lot_mails_sender',
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_mails')
  },
}
