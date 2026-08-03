'use strict'
const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('email_messages', {
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // The Log entry whose "/email to <name>" command produced this
      // message — a dedup key so re-saving a note that still contains
      // the command (e.g. editing unrelated text later) never sends a
      // second copy. Nullable + SET NULL so deleting the note keeps the
      // delivered mail intact.
      sourceLogId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'logs',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('email_messages', ['recipientId', 'createdAt'])
    await queryInterface.addIndex('email_messages', ['senderId', 'createdAt'])
    await queryInterface.addIndex('email_messages', ['sourceLogId'])
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('email_messages')
  },
}
