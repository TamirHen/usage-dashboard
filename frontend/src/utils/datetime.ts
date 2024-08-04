import moment from 'moment'

export function formatDatetimeStr(datetimeStr: string): string | undefined {
   try {
      const m = moment(datetimeStr)
      // normalise datetime to UTC to ensure time matches the example
      return m.utc().format('DD-MM-YYYY HH:mm')
   } catch (err) {
      console.error(err)
   }
}
