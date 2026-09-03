/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { Email as EmailModel } from '#shared/types'

type EmailCreateFields = Pick<
  EmailModel,
  'senderUserId' | 'recipientName' | 'channel' | 'message'
>

export class Email
  extends Model<EmailModel, EmailCreateFields>
  implements EmailModel
{
  declare id: EmailModel['id']
  declare senderUserId: EmailModel['senderUserId']
  declare recipientName: EmailModel['recipientName']
  declare channel: EmailModel['channel']
  declare message: EmailModel['message']
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
    senderUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    recipientName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    channel: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'direct',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
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
      {
        fields: ['senderUserId', 'createdAt'],
      },
    ],
  }
)
