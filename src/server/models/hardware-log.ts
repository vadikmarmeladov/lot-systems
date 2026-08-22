/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * COSMO® Cube sensor + Copy-button events, kept for device analytics
 * separately from the user-facing `logs` table.
 * Spec: docs/hardware/COSMO-SOFTWARE-API-v1.md §2.2, §6 (compression)
 */

import { DataTypes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '#server/utils/db'

export type HardwareLogAttributes = {
  id: string
  deviceId: string
  userId: string
  eventType: string
  temperature: number | null
  humidity: number | null
  pressure: number | null
  lightLux: number | null
  rawJson: Record<string, any>
  createdAt: Date
}

type HardwareLogCreateFields = Pick<HardwareLogAttributes, 'deviceId' | 'userId' | 'eventType'> &
  Partial<HardwareLogAttributes>

export class HardwareLog
  extends Model<HardwareLogAttributes, HardwareLogCreateFields>
  implements HardwareLogAttributes
{
  declare id: CreationOptional<string>
  declare deviceId: HardwareLogAttributes['deviceId']
  declare userId: HardwareLogAttributes['userId']
  declare eventType: HardwareLogAttributes['eventType']
  declare temperature: HardwareLogAttributes['temperature']
  declare humidity: HardwareLogAttributes['humidity']
  declare pressure: HardwareLogAttributes['pressure']
  declare lightLux: HardwareLogAttributes['lightLux']
  declare rawJson: CreationOptional<Record<string, any>>
  declare createdAt: CreationOptional<Date>
}

HardwareLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    deviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'hardware_devices',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    eventType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    temperature: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT,
    pressure: DataTypes.FLOAT,
    lightLux: DataTypes.INTEGER,
    rawJson: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'hardwareLog',
    tableName: 'hardware_logs',
    timestamps: true,
    updatedAt: false,
  }
)
