// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT Mail — 1:1 direct messages backing the Sync inbox.
 * The model/routes already existed; this table did not.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('direct_messages', {
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
      receiverId: {
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('direct_messages', ['receiverId', 'createdAt'], {
      name: 'idx_direct_messages_receiver_created',
    })

    await queryInterface.addIndex('direct_messages', ['senderId', 'receiverId', 'createdAt'], {
      name: 'idx_direct_messages_sender_receiver_created',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('direct_messages')
  },
}
