// @ts-check
const { DataTypes } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('direct_messages', 'channel', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'chat',
    })
    await queryInterface.addColumn('direct_messages', 'subject', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('direct_messages', 'subject')
    await queryInterface.removeColumn('direct_messages', 'channel')
  },
}
