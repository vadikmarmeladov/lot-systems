// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT® Mail — internal community messaging table.
 * Triggered by /email to [name] in Log; appears in Sync.
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
      subject: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('lot_mails', ['receiverId', 'readAt'], {
      name: 'idx_lot_mails_receiver_read',
    })
    await queryInterface.addIndex('lot_mails', ['senderId', 'createdAt'], {
      name: 'idx_lot_mails_sender_created',
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_mails')
  },
}
