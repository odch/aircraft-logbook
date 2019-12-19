import featureToggles from 'feature-toggles'
import { init } from './featureToggles'

const TOGGLE_NAMES = [
  'emailPasswordAuth',
  'registration',
  'organizationsManagement'
]

describe('util', () => {
  describe('featureToggles', () => {
    describe('init', () => {
      it('should initialize default feature toggles', () => {
        init()

        TOGGLE_NAMES.forEach(feature =>
          expect(featureToggles.isFeatureEnabled(feature)).toBe(true)
        )
      })

      it('should initialize feature toggles according to project conf', () => {
        global.__CONF__.features = {
          registration: false
        }

        init()

        const expectedToggles = TOGGLE_NAMES.reduce((map, feature) => {
          map[feature] = true
          return map
        }, {})
        expectedToggles['registration'] = false

        Object.keys(expectedToggles).forEach(feature => {
          expect(featureToggles.isFeatureEnabled(feature)).toBe(
            expectedToggles[feature]
          )
        })
      })
    })
  })
})
