// @ts-check
// LOT SYSTEMS CORPORATION — COSMO® Cube hardware tables
// Spec: docs/hardware/COSMO-SOFTWARE-API-v1.md §2.2
const { DataTypes } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('hardware_devices', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      serial: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      apiKeyHash: {
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
      },
      firmwareVersion: DataTypes.STRING(20),
      lastSeenAt: DataTypes.DATE,
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.createTable('hardware_logs', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      deviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'hardware_devices',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      eventType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      temperature: DataTypes.FLOAT,
      humidity: DataTypes.FLOAT,
      pressure: DataTypes.FLOAT,
      lightLux: DataTypes.INTEGER,
      rawJson: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      createdAt: DataTypes.DATE,
    })

    await queryInterface.createTable('hardware_notifications', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
      message: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'manual',
      },
      delivered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      expiresAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('hardware_logs', ['deviceId'])
    await queryInterface.addIndex('hardware_notifications', ['userId', 'delivered'])
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('hardware_notifications')
    await queryInterface.dropTable('hardware_logs')
    await queryInterface.dropTable('hardware_devices')
  },
}
