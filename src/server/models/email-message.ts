/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { EmailMessage as EmailMessageModel } from '#shared/types'

type EmailMessageCreateFields = Pick<
  EmailMessageModel,
  'senderId' | 'recipientId' | 'body'
> &
  Partial<Pick<EmailMessageModel, 'sourceLogId'>>

export class EmailMessage
  extends Model<EmailMessageModel, EmailMessageCreateFields>
  implements EmailMessageModel
{
  declare id: EmailMessageModel['id']
  declare senderId: EmailMessageModel['senderId']
  declare recipientId: EmailMessageModel['recipientId']
  declare body: EmailMessageModel['body']
  declare read: EmailMessageModel['read']
  declare sourceLogId: EmailMessageModel['sourceLogId']
  declare createdAt: EmailMessageModel['createdAt']
  declare updatedAt: EmailMessageModel['updatedAt']
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
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sourceLogId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'logs',
        key: 'id',
      },
      onDelete: 'SET NULL',
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
      {
        fields: ['recipientId', 'createdAt'],
      },
      {
        fields: ['senderId', 'createdAt'],
      },
      {
        fields: ['sourceLogId'],
      },
    ],
  }
)
