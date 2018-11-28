import moment from 'moment'

export const formatDate = timestamp =>
  moment(timestamp.toDate())
    .locale('de')
    .format('L')

export const formatTime = timestamp =>
  moment(timestamp.toDate())
    .locale('de')
    .format('HH:mm')
