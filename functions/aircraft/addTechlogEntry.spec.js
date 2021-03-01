const addTechlogEntry = require('./addTechlogEntry')

describe('aircraft', () => {
  describe('addTechlogEntry', () => {
    it('should throw an error if initialStatus and currentStatus are not equal', () => {
      const orgId = 'my-org'
      const aircraftId = 'my-aircraft'
      const entry = {
        initialStatus: 'crs',
        currentStatus: 'closed'
      }
      const member = {}

      return expect(
        addTechlogEntry(orgId, aircraftId, entry, member)
      ).rejects.toEqual(
        new Error("initialStatus 'crs' is not equal to currentStatus 'closed'")
      )
    })

    it('should throw an error if status can only be set by techlog manager but member has no roles', () => {
      const orgId = 'my-org'
      const aircraftId = 'my-aircraft'
      const entry = {
        initialStatus: 'crs',
        currentStatus: 'crs'
      }
      const member = {
        get: () => undefined
      }

      return expect(
        addTechlogEntry(orgId, aircraftId, entry, member)
      ).rejects.toEqual(
        new Error("Status 'crs' can only be set by techlogmanager")
      )
    })

    it('should throw an error if status can only be set by techlog manager but member has other roles', () => {
      const orgId = 'my-org'
      const aircraftId = 'my-aircraft'
      const entry = {
        initialStatus: 'crs',
        currentStatus: 'crs'
      }
      const member = {
        get: name => (name === 'roles' ? ['user'] : undefined)
      }

      return expect(
        addTechlogEntry(orgId, aircraftId, entry, member)
      ).rejects.toEqual(
        new Error("Status 'crs' can only be set by techlogmanager")
      )
    })
  })
})
