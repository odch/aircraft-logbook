import { getMemberOption, getAerodromeOption } from './getOptions'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('util', () => {
          describe('getOptions', () => {
            describe('getAerodromeOption', () => {
              it('should return the identification and name as label', () => {
                expect(
                  getAerodromeOption({
                    id: '3ADs5GZQxKbTk0of0qtS',
                    name: 'Winterthur',
                    identification: 'LSPH',
                    timezone: 'Europe/Zurich'
                  })
                ).toEqual({
                  value: '3ADs5GZQxKbTk0of0qtS',
                  label: 'LSPH (Winterthur)'
                })
              })
            })

            describe('getMemberOption', () => {
              it('should create the option object for a member', () => {
                expect(
                  getMemberOption({
                    id: '3ADs5GZQxKbTk0of0qtS',
                    firstname: 'Max',
                    lastname: 'Muster'
                  })
                ).toEqual({
                  value: '3ADs5GZQxKbTk0of0qtS',
                  label: 'Muster Max'
                })
              })
            })
          })
        })
      })
    })
  })
})
