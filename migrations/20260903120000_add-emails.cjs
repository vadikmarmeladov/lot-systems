'use strict'
const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('emails', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      senderUserId: {
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
      channel: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'direct',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
    await queryInterface.addIndex('emails', ['senderUserId', 'createdAt'])
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('emails')
  },
}
