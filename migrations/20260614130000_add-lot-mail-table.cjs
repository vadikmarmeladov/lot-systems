// @ts-check
const { Sequelize, DataTypes } = require('sequelize')

/**
 * LOT Mail — in-app message table.
 * Stores every /email command sent from Log.
 * Delivered to Sync as a chat_message; persisted here for inbox queries.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('lot_mail', {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      fromUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      toName: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    })

    await queryInterface.addIndex('lot_mail', ['fromUserId'], {
      name: 'idx_lot_mail_from_user',
    })
    await queryInterface.addIndex('lot_mail', ['toName'], {
      name: 'idx_lot_mail_to_name',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('lot_mail')
  },
}
