// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT® Email — internal messaging layer.
 * Compose in Log (/email to <name>), appear in Sync.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('lot_emails', {
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
      recipientName: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      recipientUserId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      subject: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: '',
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'sent',
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })

    await queryInterface.addIndex('lot_emails', ['senderId', 'createdAt'], {
      name: 'idx_lot_emails_sender',
    })
    await queryInterface.addIndex('lot_emails', ['recipientUserId', 'createdAt'], {
      name: 'idx_lot_emails_recipient',
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_emails')
  },
}
