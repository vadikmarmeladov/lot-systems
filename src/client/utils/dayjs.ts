import _dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc.js'
import dayjsRelativeTime from 'dayjs/plugin/relativeTime.js'
import dayjsWeekOfYear from 'dayjs/plugin/weekOfYear.js'
import dayjsIsoWeek from 'dayjs/plugin/isoWeek.js'
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat.js'
import dayjsDayOfYear from 'dayjs/plugin/dayOfYear.js'
import { Dayjs as _Dayjs } from 'dayjs'

_dayjs.extend(dayjsUtc)
_dayjs.extend(dayjsRelativeTime)
_dayjs.extend(dayjsWeekOfYear)
_dayjs.extend(dayjsIsoWeek)
_dayjs.extend(dayjsAdvancedFormat)
_dayjs.extend(dayjsDayOfYear)

export default _dayjs
export type Dayjs = _Dayjs
