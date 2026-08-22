/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { User } from './user.js'
import { Session } from './session.js'
import { EmailCode } from './email-code.js'
import { LiveMessage } from './live-message.js'
import { ChatMessage } from './chat-message.js'
import { ChatMessageLike } from './chat-message-like.js'
import { DirectMessage } from './direct-message.js'
import { WeatherResponse } from './weather-response.js'
import { Log } from './log.js'
import { Answer } from './answer.js'
import { HardwareDevice } from './hardware-device.js'
import { HardwareLog } from './hardware-log.js'
import { HardwareNotification } from './hardware-notification.js'

export type UserRecord = User

export const models = {
  User,
  Session,
  EmailCode,
  LiveMessage,
  ChatMessage,
  ChatMessageLike,
  DirectMessage,
  WeatherResponse,
  Log,
  Answer,
  HardwareDevice,
  HardwareLog,
  HardwareNotification,
}

export type Models = {
  User: typeof User
  Session: typeof Session
  EmailCode: typeof EmailCode
  LiveMessage: typeof LiveMessage
  ChatMessage: typeof ChatMessage
  ChatMessageLike: typeof ChatMessageLike
  DirectMessage: typeof DirectMessage
  WeatherResponse: typeof WeatherResponse
  Log: typeof Log
  Answer: typeof Answer
  HardwareDevice: typeof HardwareDevice
  HardwareLog: typeof HardwareLog
  HardwareNotification: typeof HardwareNotification
}

User.hasMany(Session)

Session.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
})

User.hasMany(HardwareDevice, { foreignKey: 'userId' })
HardwareDevice.belongsTo(User, { targetKey: 'id', foreignKey: 'userId' })

HardwareDevice.hasMany(HardwareLog, { foreignKey: 'deviceId' })
HardwareLog.belongsTo(HardwareDevice, { targetKey: 'id', foreignKey: 'deviceId' })

User.hasMany(HardwareNotification, { foreignKey: 'userId' })
HardwareNotification.belongsTo(User, { targetKey: 'id', foreignKey: 'userId' })

export interface SessionWithUser extends Session {
  user?: User
}
