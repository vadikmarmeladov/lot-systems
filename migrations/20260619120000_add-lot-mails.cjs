// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT Mail — internal messaging layer.
 * Compose via /email to <name> in Log. Arrives in Sync inbox.
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
      senderName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recipientName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      message: {
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

    await queryInterface.addIndex('lot_mails', ['recipientName', 'createdAt'], {
      name: 'idx_lot_mails_recipient_created',
    })
    await queryInterface.addIndex('lot_mails', ['senderId'], {
      name: 'idx_lot_mails_sender',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_mails')
  },
}
