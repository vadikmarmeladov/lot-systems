/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { LotEmail as LotEmailModel } from '#shared/types'

type LotEmailCreateFields = Pick<
  LotEmailModel,
  'fromUserId' | 'fromName' | 'toName' | 'body'
> & {
  toUserId?: string | null
  subject?: string | null
  status?: 'sent' | 'read'
}

export class LotEmail
  extends Model<LotEmailModel, LotEmailCreateFields>
  implements LotEmailModel
{
  declare id: LotEmailModel['id']
  declare fromUserId: LotEmailModel['fromUserId']
  declare toUserId: LotEmailModel['toUserId']
  declare fromName: LotEmailModel['fromName']
  declare toName: LotEmailModel['toName']
  declare subject: LotEmailModel['subject']
  declare body: LotEmailModel['body']
  declare status: LotEmailModel['status']
  declare createdAt: LotEmailModel['createdAt']
  declare updatedAt: LotEmailModel['updatedAt']
}

LotEmail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    fromUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    toUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'SET NULL',
    },
    fromName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    toName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('sent', 'read'),
      allowNull: false,
      defaultValue: 'sent',
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
      { fields: ['toUserId', 'createdAt'] },
      { fields: ['fromUserId', 'createdAt'] },
    ],
  }
)
