const STATUS = [
  { id: 'for_information_only', closed: false, requiresManager: false },
  { id: 'defect_aog', closed: false, requiresManager: false },
  { id: 'defect_unknown', closed: false, requiresManager: false },
  { id: 'defect_with_limitations', closed: false, requiresManager: true },
  { id: 'defect_not_flight_relevant', closed: false, requiresManager: true },
  { id: 'closed', closed: true, requiresManager: true },
  { id: 'crs', closed: true, requiresManager: true },
  { id: 'arc', closed: true, requiresManager: true }
]

export const getTechlogStatus = isTechlogManager =>
  isTechlogManager === true
    ? STATUS.slice(0)
    : STATUS.filter(status => status.requiresManager === false)

export const getTechlogActionStatus = isTechlogManager =>
  isTechlogManager
    ? getTechlogStatus(true)
    : STATUS.filter(status =>
        ['for_information_only', 'closed'].includes(status.id)
      )

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
