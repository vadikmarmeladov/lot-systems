// @ts-check
const { Sequelize, DataTypes } = require('sequelize')

// Adds addressing to chat_messages so a targeted "LOT Email" message can ride
// the exact same table, SSE channel ('chat_message'), and Sync feed as public
// chat — the simplest way to add addressed mail without a parallel inbox.
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('chat_messages', 'recipientUserId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    })
    await queryInterface.addColumn('chat_messages', 'kind', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'chat',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('chat_messages', 'recipientUserId')
    await queryInterface.removeColumn('chat_messages', 'kind')
  },
}
