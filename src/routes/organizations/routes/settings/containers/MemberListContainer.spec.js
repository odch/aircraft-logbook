import { matches, filterMembers } from './MemberListContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('containers', () => {
          describe('MemberListContainer', () => {
            describe('matches', () => {
              it('should return true if one part matches the value', () => {
                expect(matches('Hans', ['hans', 'meier'])).toEqual(true)
              })

              it('should return false if no part matches the value', () => {
                expect(matches('Kurt', ['hans', 'meier'])).toEqual(false)
              })

              it('should return false if the value is undefined', () => {
                expect(matches(undefined, ['hans', 'meier'])).toEqual(false)
              })
            })

            describe('filterMembers', () => {
              const members = [
                {
                  firstname: 'Hans',
                  lstname: 'Meier',
                  nr: '23662'
                },
                {
                  firstname: 'Kurt',
                  lastname: 'Keller'
                },
                {
                  firstname: 'Stefan',
                  lastname: 'Gamper'
                }
              ]

              it('should return the matching members with one term', () => {
                expect(filterMembers(members, '  hans  ')).toEqual([members[0]])
              })

              it('should return the matching members with multiple terms', () => {
                expect(filterMembers(members, '  hans  gamper ')).toEqual([
                  members[0],
                  members[2]
                ])
              })

              it('should return all members if the filter is empty', () => {
                expect(filterMembers(members, '')).toEqual(members)
              })
            })
          })
        })
      })
    })
  })
})
