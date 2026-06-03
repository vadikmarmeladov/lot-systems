// @ts-check
const { Sequelize, DataTypes } = require('sequelize')

/**
 * Ration Issues — append-only issue ledger per subscriber.
 * LOT-FM-001 / Month 3: issue & fulfillment engine.
 * Each row = one monthly shipment. Nothing overwrites.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('ration_issues', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      issueNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'scheduled',
      },
      items: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      shippedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      trackingNumber: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      manifestCard: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    })

    await queryInterface.addIndex('ration_issues', ['userId'], {
      name: 'idx_ration_issues_user_id',
    })
    await queryInterface.addIndex('ration_issues', ['userId', 'issueNumber'], {
      name: 'idx_ration_issues_user_issue',
      unique: true,
    })
    await queryInterface.addIndex('ration_issues', ['status'], {
      name: 'idx_ration_issues_status',
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('ration_issues')
  },
}
