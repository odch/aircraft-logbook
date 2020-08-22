const STATUS = [
  { id: 'for_information_only', closed: false, requiresManager: true },
  { id: 'not_airworthy', closed: false, requiresManager: false },
  { id: 'not_flight_relevant', closed: false, requiresManager: false },
  { id: 'closed', closed: true, requiresManager: true },
  { id: 'crs', closed: true, requiresManager: true },
  { id: 'crs_check', closed: true, requiresManager: true },
  { id: 'annual_review', closed: true, requiresManager: true }
]

export const getTechlogStatus = isTechlogManager =>
  isTechlogManager === true
    ? STATUS.slice(0)
    : STATUS.filter(status => status.requiresManager === false)

export const getOpenTechlogStatus = () =>
  STATUS.filter(
    status => status.closed === false && status.requiresManager === false
  )

export const isClosed = statusId => {
  const status = STATUS.find(status => status.id === statusId)
  if (!status) {
    throw new Error(`Status ${statusId} not found`)
  }
  return status.closed === true
}
