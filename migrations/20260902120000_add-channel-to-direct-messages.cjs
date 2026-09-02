// @ts-check
const { DataTypes } = require('sequelize')

// Adds a channel column to direct_messages so a LOT Email (composed via the
// `/email to <Name>` Log command) can share the same sender/receiver thread
// as an ordinary Sync direct chat message, distinguished at read time.
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('direct_messages', 'channel', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'chat',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('direct_messages', 'channel')
  },
}
