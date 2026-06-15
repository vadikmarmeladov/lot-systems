/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { LotMail as LotMailType } from '#shared/types'

type LotMailCreateFields = Pick<
  LotMailType,
  'senderId' | 'recipientId' | 'body'
> & { subject?: string | null }

export class LotMail
  extends Model<LotMailType, LotMailCreateFields>
  implements LotMailType
{
  declare id: LotMailType['id']
  declare senderId: LotMailType['senderId']
  declare recipientId: LotMailType['recipientId']
  declare subject: LotMailType['subject']
  declare body: LotMailType['body']
  declare isRead: LotMailType['isRead']
  declare createdAt: LotMailType['createdAt']
  declare updatedAt: LotMailType['updatedAt']
}

LotMail.init(
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
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'lot_mail',
    tableName: 'lot_mail',
    timestamps: true,
    indexes: [
      { fields: ['recipientId', 'createdAt'] },
      { fields: ['senderId', 'createdAt'] },
      { fields: ['recipientId', 'isRead'] },
    ],
  }
)
