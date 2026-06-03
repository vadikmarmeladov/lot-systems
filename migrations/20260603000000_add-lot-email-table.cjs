// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT® Email — internal messaging table.
 * Composed via /email command in Log; surfaced in Sync.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('lot_emails', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fromUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      toUserId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      toHandle: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(200),
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
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('lot_emails', ['toUserId', 'createdAt'], {
      name: 'idx_lot_emails_to_user_created',
    })
    await queryInterface.addIndex('lot_emails', ['fromUserId', 'createdAt'], {
      name: 'idx_lot_emails_from_user_created',
    })
    await queryInterface.addIndex('lot_emails', ['toUserId', 'isRead'], {
      name: 'idx_lot_emails_to_user_read',
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_emails')
  },
}
