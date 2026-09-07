'use strict'
const { DataTypes } = require('sequelize')

/**
 * Backfills the `direct_messages` table. The Sequelize model
 * (src/server/models/direct-message.ts) and its routes have existed
 * since the DirectMessageThread feature was added, but no migration
 * ever created the table — LOT Email (SR-20260907) builds on this
 * table, so the gap is closed here.
 *
 * @type {import('sequelize-cli').Migration}
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

    await queryInterface.addIndex('direct_messages', ['receiverId', 'createdAt'])
    await queryInterface.addIndex('direct_messages', ['senderId', 'receiverId', 'createdAt'])
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('direct_messages')
  },
}
