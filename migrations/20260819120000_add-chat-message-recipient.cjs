// @ts-check
const { DataTypes } = require('sequelize')

// LOT Email: an addressed chat message. Adds an optional recipient to
// chat_messages so "/email to <name>" can land in Sync as a message
// that carries a destination, without a parallel table/route/SSE channel.
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('chat_messages', 'recipientName', {
      type: DataTypes.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn('chat_messages', 'recipientUserId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('chat_messages', 'recipientUserId')
    await queryInterface.removeColumn('chat_messages', 'recipientName')
  },
}
