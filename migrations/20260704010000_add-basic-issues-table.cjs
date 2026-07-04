// @ts-check
const { DataTypes } = require('sequelize')

/**
 * LOT-FM-001 / BASIC RATION MODULE — MONTH 3
 * One row per scheduled/dispatched ration issue.
 */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('basic_issues', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      issueNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      scheduledFor: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dispatchedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'SCHEDULED',
      },
      items: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      cogsCents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    })

    await queryInterface.addIndex('basic_issues', ['userId'], {
      name: 'idx_basic_issues_user_id',
    })

    await queryInterface.addIndex('basic_issues', ['userId', 'issueNumber'], {
      name: 'idx_basic_issues_user_id_issue_number',
      unique: true,
    })

    await queryInterface.addIndex('basic_issues', ['status'], {
      name: 'idx_basic_issues_status',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('basic_issues')
  },
}
