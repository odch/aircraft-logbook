const STATUS = [
  { id: 'for_information_only', closed: false },
  { id: 'not_airworthy', closed: false },
  { id: 'not_flight_relevant', closed: false },
  { id: 'closed', closed: true },
  { id: 'crs', closed: true },
  { id: 'crs_check', closed: true },
  { id: 'annual_review', closed: true }
]

export const getTechlogStatus = isTechlogManager =>
  isTechlogManager === true
    ? STATUS.slice(0)
    : STATUS.filter(status => status.closed === false)

export const getOpenTechlogStatus = () =>
  STATUS.filter(status => status.closed === false)

export const isClosed = statusId => {
  const status = STATUS.find(status => status.id === statusId)
  if (!status) {
    throw new Error(`Status ${statusId} not found`)
  }
  return status.closed === true
}
