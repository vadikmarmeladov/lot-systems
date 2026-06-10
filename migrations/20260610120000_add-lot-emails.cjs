// @ts-check
const { DataTypes } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('lot_emails', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
        onDelete: 'SET NULL',
      },
      fromName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      toName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      subject: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('sent', 'read'),
        allowNull: false,
        defaultValue: 'sent',
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
    await queryInterface.addIndex('lot_emails', ['toUserId', 'createdAt'])
    await queryInterface.addIndex('lot_emails', ['fromUserId', 'createdAt'])
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_emails')
  },
}
