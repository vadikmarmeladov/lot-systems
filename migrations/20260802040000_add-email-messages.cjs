// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT Email — composed in Log via "/email to <name>", delivered through Sync.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('email_messages', {
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
      recipientName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('email_messages', ['recipientId', 'createdAt'], {
      name: 'idx_email_messages_recipient_created',
    })

    await queryInterface.addIndex('email_messages', ['senderId', 'recipientId', 'createdAt'], {
      name: 'idx_email_messages_sender_recipient_created',
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('email_messages')
  },
}
