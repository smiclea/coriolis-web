import moment from 'moment'

class DateUtils {
  static getLocalTime(rawDate) {
    let offset = (new Date().getTimezoneOffset() / 60) * -1

    return moment(rawDate).add(offset, 'hours')
  }
}

export default DateUtils
