/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { MailMessage as MailMessageModel } from '#shared/types'

type MailMessageCreateFields = Pick<
  MailMessageModel,
  'senderId' | 'recipientId' | 'message'
>

export class MailMessage
  extends Model<MailMessageModel, MailMessageCreateFields>
  implements MailMessageModel
{
  declare id: MailMessageModel['id']
  declare senderId: MailMessageModel['senderId']
  declare recipientId: MailMessageModel['recipientId']
  declare message: MailMessageModel['message']
  declare readAt: CreationOptional<MailMessageModel['readAt']>
  declare createdAt: MailMessageModel['createdAt']
  declare updatedAt: MailMessageModel['updatedAt']
}

MailMessage.init(
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'mail_message',
    tableName: 'mail_messages',
    timestamps: true,
    indexes: [
      {
        fields: ['recipientId', 'createdAt'],
      },
      {
        fields: ['senderId', 'recipientId', 'createdAt'],
      },
    ],
  }
)
