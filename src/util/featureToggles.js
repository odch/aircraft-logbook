import featureToggles from 'feature-toggles'

const TOGGLES = {
  registration: true,
  organizationsManagement: true
}

function getToggles() {
  const merged = {
    ...TOGGLES
  }

  const projectToggles = __CONF__.features || {}

  Object.keys(projectToggles).forEach(feature => {
    if (Object.prototype.hasOwnProperty.call(merged, feature)) {
      merged[feature] = projectToggles[feature]
    } else {
      throw `Unknown feature toggle '${feature}'`
    }
  })

  return merged
}

export function init() {
  const toggles = getToggles()
  featureToggles.load(toggles)
}
