import _get from 'lodash.get'

const getMissingFields = (data, fields) =>
  fields.reduce(
    (missingFields, field) =>
      typeof _get(data, field) === 'undefined'
        ? [...missingFields, field]
        : [...missingFields],
    []
  )

export default getMissingFields
