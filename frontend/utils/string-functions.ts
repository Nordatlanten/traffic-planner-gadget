export const calcTravelTime = (start: string, end: string) => {
  let sum = Date.parse(end) - Date.parse(start)
  const slices: string[] = []

  const msInHour = 1000 * 60 * 60
  const hours = Math.trunc(sum / msInHour)
  if (hours > 0) {
    slices.push(hours + 'h')
    sum = sum - (hours * msInHour)
  }
  const msInMinute = 1000 * 60
  const minutes = Math.trunc(sum / msInMinute)
  if (minutes > 0) {
    slices.push(minutes + ' min')
  }
  if (slices.length == 0) {
    return '0 min'
  } 
  return slices.join(' ')
}

const re = /([0-9]){2}:([0-9]){2}/
export const escapeTimeStamp = (string: string) => {
  let match
  if (string) {
    match = string.match(re)
  } 
  if (match) return match[0]
}
