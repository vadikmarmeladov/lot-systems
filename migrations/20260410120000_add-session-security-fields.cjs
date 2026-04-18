// @ts-check
const { Sequelize, DataTypes } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add expiration tracking to sessions
      await queryInterface.addColumn('sessions', 'expiresAt', {
        type: DataTypes.DATE,
        allowNull: true,
      }, { transaction })

      // Track the IP that created the session (for suspicious activity detection)
      await queryInterface.addColumn('sessions', 'createdFromIp', {
        type: DataTypes.STRING(45), // IPv6 max length
        allowNull: true,
      }, { transaction })

      // Lightweight browser fingerprint for session hijacking detection
      await queryInterface.addColumn('sessions', 'fingerprint', {
        type: DataTypes.STRING(16),
        allowNull: true,
      }, { transaction })

      // Last time this session was used (for idle timeout)
      await queryInterface.addColumn('sessions', 'lastUsedAt', {
        type: DataTypes.DATE,
        allowNull: true,
      }, { transaction })

      // Create index for efficient expired session cleanup
      await queryInterface.addIndex('sessions', ['expiresAt'], {
        name: 'idx_sessions_expires_at',
        transaction,
      })

      // Create index for user session lookups
      await queryInterface.addIndex('sessions', ['userId'], {
        name: 'idx_sessions_user_id',
        transaction,
      })
    })
  },
  async down({ context: queryInterface }) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('sessions', 'idx_sessions_user_id', { transaction })
      await queryInterface.removeIndex('sessions', 'idx_sessions_expires_at', { transaction })
      await queryInterface.removeColumn('sessions', 'lastUsedAt', { transaction })
      await queryInterface.removeColumn('sessions', 'fingerprint', { transaction })
      await queryInterface.removeColumn('sessions', 'createdFromIp', { transaction })
      await queryInterface.removeColumn('sessions', 'expiresAt', { transaction })
    })
  },
}
