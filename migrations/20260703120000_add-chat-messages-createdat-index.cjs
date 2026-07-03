'use strict'

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.sequelize.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_createdat
      ON chat_messages ("createdAt" DESC)
    `)
  },

  async down({ context: queryInterface }) {
    await queryInterface.sequelize.query(`
      DROP INDEX CONCURRENTLY IF EXISTS idx_chat_messages_createdat
    `)
  },
}
