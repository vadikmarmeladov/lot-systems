/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * Pager-like message queue delivered to a COSMO® Cube's OLED screen.
 * Spec: docs/hardware/COSMO-SOFTWARE-API-v1.md §2.2, §3.1, §4.3
 */

import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'

export type HardwareNotificationAttributes = {
  id: string
  userId: string
  message: string
  source: string
  delivered: boolean
  createdAt: Date
  expiresAt: Date | null
}

type HardwareNotificationCreateFields = Pick<HardwareNotificationAttributes, 'userId' | 'message'> &
  Partial<HardwareNotificationAttributes>

export class HardwareNotification
  extends Model<HardwareNotificationAttributes, HardwareNotificationCreateFields>
  implements HardwareNotificationAttributes
{
  declare id: CreationOptional<string>
  declare userId: HardwareNotificationAttributes['userId']
  declare message: HardwareNotificationAttributes['message']
  declare source: CreationOptional<string>
  declare delivered: CreationOptional<boolean>
  declare createdAt: CreationOptional<Date>
  declare expiresAt: HardwareNotificationAttributes['expiresAt']
}

HardwareNotification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    message: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'manual',
    },
    delivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    expiresAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'hardwareNotification',
    tableName: 'hardware_notifications',
    timestamps: true,
    updatedAt: false,
  }
)
