/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { LotMail as LotMailModel } from '#shared/types'

type LotMailCreateFields = Pick<
  LotMailModel,
  'senderId' | 'senderName' | 'recipientName' | 'message'
>

export class LotMail
  extends Model<LotMailModel, LotMailCreateFields>
  implements LotMailModel
{
  declare id: LotMailModel['id']
  declare senderId: LotMailModel['senderId']
  declare senderName: LotMailModel['senderName']
  declare recipientName: LotMailModel['recipientName']
  declare message: LotMailModel['message']
  declare isRead: LotMailModel['isRead']
  declare createdAt: LotMailModel['createdAt']
  declare updatedAt: LotMailModel['updatedAt']
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
    senderName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipientName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message: {
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
    tableName: 'lot_mails',
    timestamps: true,
  }
)
