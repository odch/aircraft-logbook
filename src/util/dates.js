import moment from 'moment'

export const formatDate = timestamp => moment(timestamp.toDate()).format('L')

export const formatTime = timestamp =>
  moment(timestamp.toDate()).format('HH:mm')
