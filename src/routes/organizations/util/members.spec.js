import { expectSaga } from 'redux-saga-test-plan'
import * as members from './members'

describe('routes', () => {
  describe('organizations', () => {
    describe('util', () => {
      describe('members', () => {
        describe('getCurrentMember', () => {
          it('should return the current member', () => {
            const member1 = {
              firstname: 'Max',
              lastname: 'Muster',
              user: undefined
            }
            const member2 = {
              firstname: 'Hans',
              lastname: 'Meier',
              user: {
                id: 'o7flC7jw8j'
              }
            }
            return expectSaga(members.getCurrentMember)
              .withState({
                firebase: {
                  auth: {
                    uid: 'o7flC7jw8j'
                  }
                },
                firestore: {
                  ordered: {
                    organizationMembers: [member1, member2]
                  }
                }
              })
              .returns(member2)
              .run()
          })
        })
      })
    })
  })
})
