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
  'fromUserId' | 'toUserId' | 'toHandle' | 'subject' | 'body'
>

export class LotEmail
  extends Model<LotEmailModel, LotEmailCreateFields>
  implements LotEmailModel
{
  declare id: LotEmailModel['id']
  declare fromUserId: LotEmailModel['fromUserId']
  declare toUserId: LotEmailModel['toUserId']
  declare toHandle: LotEmailModel['toHandle']
  declare subject: LotEmailModel['subject']
  declare body: LotEmailModel['body']
  declare isRead: LotEmailModel['isRead']
  declare readAt: LotEmailModel['readAt']
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
      onDelete: 'CASCADE',
    },
    toHandle: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: true,
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
    readAt: {
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
      { fields: ['toUserId', 'createdAt'] },
      { fields: ['fromUserId', 'createdAt'] },
      { fields: ['toUserId', 'isRead'] },
    ],
  }
)
