// @ts-check
const { Sequelize, DataTypes } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      event: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      details: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      requestId: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    })

    // Index for querying audit logs by event type
    await queryInterface.addIndex('audit_logs', ['event'], {
      name: 'idx_audit_logs_event',
    })

    // Index for querying by user
    await queryInterface.addIndex('audit_logs', ['userId'], {
      name: 'idx_audit_logs_user_id',
    })

    // Index for querying by time range
    await queryInterface.addIndex('audit_logs', ['timestamp'], {
      name: 'idx_audit_logs_timestamp',
    })

    // Composite index for IP-based lookups within a time window
    await queryInterface.addIndex('audit_logs', ['ip', 'timestamp'], {
      name: 'idx_audit_logs_ip_timestamp',
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('audit_logs')
  },
}
