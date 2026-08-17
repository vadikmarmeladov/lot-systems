// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT Mail — in-app email. /email log trigger composes; SSE delivers via
 * Sync; recipient resolution is scoped to the LOT Community (Usership,
 * Onyx, Legacy, R&D, Admin — same tag gate as Sync chat).
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('mail_messages', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      readAt: {
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

    await queryInterface.addIndex('mail_messages', ['recipientId', 'createdAt'], {
      name: 'idx_mail_messages_recipient_created',
    })

    await queryInterface.addIndex('mail_messages', ['senderId', 'recipientId', 'createdAt'], {
      name: 'idx_mail_messages_sender_recipient_created',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('mail_messages')
  },
}
