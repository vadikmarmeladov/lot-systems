/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { Email as EmailModel, EmailStatus } from '#shared/types'

type EmailCreateFields = Pick<
  EmailModel,
  'senderId' | 'recipientId' | 'recipientName' | 'subject' | 'body' | 'status' | 'resendMessageId'
>

export class Email
  extends Model<EmailModel, EmailCreateFields>
  implements EmailModel
{
  declare id: EmailModel['id']
  declare senderId: EmailModel['senderId']
  declare recipientId: EmailModel['recipientId']
  declare recipientName: EmailModel['recipientName']
  declare subject: EmailModel['subject']
  declare body: EmailModel['body']
  declare status: EmailModel['status']
  declare resendMessageId: EmailModel['resendMessageId']
  declare createdAt: EmailModel['createdAt']
  declare updatedAt: EmailModel['updatedAt']
}

Email.init(
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
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unresolved' as EmailStatus,
    },
    resendMessageId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'email',
    tableName: 'emails',
    timestamps: true,
    indexes: [
      { fields: ['senderId', 'createdAt'] },
      { fields: ['recipientId', 'createdAt'] },
    ],
  }
)
