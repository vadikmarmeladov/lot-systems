import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'
import { LotMail as LotMailModel } from '#shared/types'

type LotMailCreateFields = Pick<LotMailModel, 'senderId' | 'receiverId' | 'message'>

export class LotMail
  extends Model<LotMailModel, LotMailCreateFields>
  implements LotMailModel
{
  declare id: LotMailModel['id']
  declare senderId: LotMailModel['senderId']
  declare receiverId: LotMailModel['receiverId']
  declare message: LotMailModel['message']
  declare isRead: LotMailModel['isRead']
  declare createdAt: CreationOptional<LotMailModel['createdAt']>
  declare updatedAt: CreationOptional<LotMailModel['updatedAt']>
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
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    receiverId: {
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
    indexes: [
      { fields: ['receiverId', 'createdAt'] },
      { fields: ['senderId', 'receiverId'] },
    ],
  }
)
