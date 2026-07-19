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
  'senderId' | 'recipientId' | 'recipientQuery' | 'body' | 'status'
>

export class LotEmail
  extends Model<LotEmailModel, LotEmailCreateFields>
  implements LotEmailModel
{
  declare id: LotEmailModel['id']
  declare senderId: LotEmailModel['senderId']
  declare recipientId: LotEmailModel['recipientId']
  declare recipientQuery: LotEmailModel['recipientQuery']
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
      onDelete: 'CASCADE',
    },
    recipientQuery: {
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
      defaultValue: 'unresolved',
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
      {
        fields: ['recipientId', 'createdAt'],
      },
      {
        fields: ['senderId', 'createdAt'],
      },
    ],
  }
)
