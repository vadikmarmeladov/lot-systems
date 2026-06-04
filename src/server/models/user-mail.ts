/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { UserMail as UserMailModel } from '#shared/types'

type CreateFields = Pick<UserMailModel, 'senderId' | 'recipientId' | 'body'> & {
  subject?: string | null
  cohortTag?: string | null
}

export class UserMail
  extends Model<UserMailModel, CreateFields>
  implements UserMailModel
{
  declare id: UserMailModel['id']
  declare senderId: UserMailModel['senderId']
  declare recipientId: UserMailModel['recipientId']
  declare subject: UserMailModel['subject']
  declare body: UserMailModel['body']
  declare readAt: UserMailModel['readAt']
  declare cohortTag: UserMailModel['cohortTag']
  declare createdAt: UserMailModel['createdAt']
  declare updatedAt: UserMailModel['updatedAt']
}

UserMail.init(
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
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cohortTag: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'user_mail',
    tableName: 'user_mails',
    timestamps: true,
    indexes: [
      { fields: ['recipientId', 'createdAt'] },
      { fields: ['senderId', 'createdAt'] },
    ],
  }
)
