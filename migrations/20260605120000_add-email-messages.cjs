// @ts-check
const { DataTypes } = require('sequelize')

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
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      subject: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.addIndex('email_messages', ['receiverId', 'createdAt'])
    await queryInterface.addIndex('email_messages', ['senderId', 'createdAt'])
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('email_messages')
  },
}
