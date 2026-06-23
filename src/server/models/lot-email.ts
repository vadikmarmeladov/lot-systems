/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { LotEmail as LotEmailModel } from '#shared/types'

type LotEmailCreateFields = Pick<
  LotEmailModel,
  'senderId' | 'recipientName' | 'recipientUserId' | 'subject' | 'body' | 'status' | 'sentAt'
>

export class LotEmail
  extends Model<LotEmailModel, LotEmailCreateFields>
  implements LotEmailModel
{
  declare id: LotEmailModel['id']
  declare senderId: LotEmailModel['senderId']
  declare recipientName: LotEmailModel['recipientName']
  declare recipientUserId: LotEmailModel['recipientUserId']
  declare subject: LotEmailModel['subject']
  declare body: LotEmailModel['body']
  declare status: LotEmailModel['status']
  declare sentAt: LotEmailModel['sentAt']
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

LotEmail.init(
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
    recipientName: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    recipientUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'SET NULL',
    },
    subject: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: '',
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'sent',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'lot_email',
    tableName: 'lot_emails',
    timestamps: true,
    indexes: [
      { fields: ['senderId', 'createdAt'] },
      { fields: ['recipientUserId', 'createdAt'] },
    ],
  }
)
