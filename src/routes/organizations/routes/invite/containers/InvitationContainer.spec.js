import { getInvite } from './InvitationContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('invite', () => {
        describe('containers', () => {
          describe('InvitationContainer', () => {
            describe('getInvite', () => {
              it('should return undefined if invite not loaded', () => {
                const state = {
                  invite: {}
                }
                expect(getInvite(state)).toEqual(undefined)
              })

              it('should return null if invite is null', () => {
                const state = {
                  invite: {
                    invite: null
                  }
                }
                expect(getInvite(state)).toEqual(null)
              })

              it('should return null if invite is deleted', () => {
                const state = {
                  invite: {
                    invite: {
                      deleted: true
                    }
                  }
                }
                expect(getInvite(state)).toEqual(null)
              })

              it('should return invite if not accepted', () => {
                const state = {
                  invite: {
                    invite: {
                      firstname: 'Max',
                      lastname: 'Muster',
                      deleted: false
                    }
                  }
                }
                expect(getInvite(state)).toEqual({
                  firstname: 'Max',
                  lastname: 'Muster',
                  accepted: false
                })
              })

              it('should return accepted invite if linked user is current user', () => {
                const state = {
                  invite: {
                    invite: {
                      firstname: 'Max',
                      lastname: 'Muster',
                      deleted: false,
                      user: { id: 'user-id' }
                    }
                  },
                  firebase: {
                    auth: {
                      isEmpty: false,
                      uid: 'user-id'
                    }
                  }
                }
                expect(getInvite(state)).toEqual({
                  firstname: 'Max',
                  lastname: 'Muster',
                  accepted: true
                })
              })

              it('should return null if linked user is not current user', () => {
                const state = {
                  invite: {
                    invite: {
                      firstname: 'Max',
                      lastname: 'Muster',
                      deleted: false,
                      user: { id: 'other-user-id' }
                    }
                  },
                  firebase: {
                    auth: {
                      isEmpty: false,
                      uid: 'user-id'
                    }
                  }
                }
                expect(getInvite(state)).toEqual(null)
              })
            })
          })
        })
      })
    })
  })
})
