/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { Op } from 'sequelize'
import dayjs from '#server/utils/dayjs'
import { LogContext, User } from '#shared/types'
import { DATE_TIME_FORMAT, WEATHER_STALE_TIME_MINUTES } from '#shared/constants'
import { getWesternZodiac, getMoonPhase } from '#shared/utils'
import { models } from '../models/index.js'

// The environmental snapshot taken on every user click/entry — weather,
// time, humidity, sky, location, astrology. No photo or sound, just this.
export async function getLogContext(user: User): Promise<LogContext> {
  const now = user.timeZone ? dayjs().tz(user.timeZone).toDate() : new Date()
  const moon = getMoonPhase(now)

  const context: LogContext = {
    temperature: null,
    humidity: null,
    weatherDescription: null,
    sky: null,
    country: user.country,
    city: user.city,
    timeZone: user.timeZone,
    date: user.timeZone
      ? dayjs().tz(user.timeZone).format(DATE_TIME_FORMAT)
      : null,
    zodiacSign: getWesternZodiac(now),
    moonPhase: moon.phase,
    moonIllumination: moon.illumination,
  }
  if (user.country && user.city) {
    const cachedWeather = await models.WeatherResponse.findOne({
      where: {
        city: user.city,
        country: user.country,
        createdAt: {
          [Op.gte]: dayjs()
            .subtract(WEATHER_STALE_TIME_MINUTES, 'minute')
            .toDate(),
        },
      },
      order: [['createdAt', 'DESC']],
    })
    if (cachedWeather) {
      context.temperature = cachedWeather.weather?.tempKelvin || null
      context.humidity = cachedWeather.weather?.humidity || null
      context.weatherDescription = cachedWeather.weather?.description || null
      context.sky = cachedWeather.weather?.description || null
    }
  }
  return context
}
