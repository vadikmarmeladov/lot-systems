'use strict'

const { DataTypes } = require('sequelize')

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('lot_emails', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      subject: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    })

    await queryInterface.addIndex('lot_emails', ['receiverId', 'createdAt'])
    await queryInterface.addIndex('lot_emails', ['senderId', 'createdAt'])
  },

  async down(queryInterface) {
    await queryInterface.dropTable('lot_emails')
  },
}
