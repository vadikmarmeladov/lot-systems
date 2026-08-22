/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * COSMO® Cube device registry — one row per paired hardware unit.
 * Spec: docs/hardware/COSMO-SOFTWARE-API-v1.md §2.2
 */

import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'

export type HardwareDeviceAttributes = {
  id: string
  serial: string
  apiKeyHash: string
  userId: string | null
  firmwareVersion: string | null
  lastSeenAt: Date | null
  active: boolean
  createdAt: Date
  updatedAt: Date
}

type HardwareDeviceCreateFields = Pick<HardwareDeviceAttributes, 'serial' | 'apiKeyHash'> &
  Partial<HardwareDeviceAttributes>

export class HardwareDevice
  extends Model<HardwareDeviceAttributes, HardwareDeviceCreateFields>
  implements HardwareDeviceAttributes
{
  declare id: CreationOptional<string>
  declare serial: HardwareDeviceAttributes['serial']
  declare apiKeyHash: HardwareDeviceAttributes['apiKeyHash']
  declare userId: HardwareDeviceAttributes['userId']
  declare firmwareVersion: HardwareDeviceAttributes['firmwareVersion']
  declare lastSeenAt: HardwareDeviceAttributes['lastSeenAt']
  declare active: CreationOptional<boolean>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

HardwareDevice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    serial: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    apiKeyHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    firmwareVersion: DataTypes.STRING(20),
    lastSeenAt: DataTypes.DATE,
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'hardwareDevice',
    tableName: 'hardware_devices',
    timestamps: true,
  }
)
