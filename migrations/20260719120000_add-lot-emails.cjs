'use strict'
const { DataTypes } = require('sequelize')

// LOT Email: the simplest possible mail primitive. A "/email to <name>"
// command typed into a Log entry resolves a recipient by first name and
// lands a row here. recipientId stays null (status 'unresolved') when no
// user matches the query yet — the row is kept so a future match (e.g. a
// Cohort Dating persona joining LOT Community) can still surface it.
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({ context: queryInterface }) {
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
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      recipientQuery: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unresolved',
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('lot_emails', ['recipientId', 'createdAt'])
    await queryInterface.addIndex('lot_emails', ['senderId', 'createdAt'])
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_emails')
  },
}
