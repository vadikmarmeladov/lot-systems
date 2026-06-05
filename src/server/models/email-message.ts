/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { LotEmail } from '#shared/types'

type EmailCreateFields = Pick<
  LotEmail,
  'senderId' | 'receiverId' | 'subject' | 'body'
>

export class EmailMessage
  extends Model<LotEmail, EmailCreateFields>
  implements LotEmail
{
  declare id: LotEmail['id']
  declare senderId: LotEmail['senderId']
  declare receiverId: LotEmail['receiverId']
  declare subject: LotEmail['subject']
  declare body: LotEmail['body']
  declare isRead: LotEmail['isRead']
  declare createdAt: LotEmail['createdAt']
  declare updatedAt: LotEmail['updatedAt']
}

EmailMessage.init(
  {
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
  },
  {
    sequelize,
    modelName: 'email_message',
    tableName: 'email_messages',
    timestamps: true,
    indexes: [
      { fields: ['receiverId', 'createdAt'] },
      { fields: ['senderId', 'createdAt'] },
    ],
  }
)
