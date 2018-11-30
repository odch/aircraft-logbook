import {
  getMemberOption,
  getMemberOptions,
  getAerodromeOption,
  getAerodromeOptions
} from './getOptions'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('util', () => {
          describe('getOptions', () => {
            describe('getAerodromeOption', () => {
              it('should return the name and identification as label', () => {
                expect(
                  getAerodromeOption({
                    id: '3ADs5GZQxKbTk0of0qtS',
                    name: 'Winterthur',
                    identification: 'LSPH',
                    timezone: 'Europe/Zurich'
                  })
                ).toEqual({
                  value: '3ADs5GZQxKbTk0of0qtS',
                  label: 'Winterthur (LSPH)'
                })
              })

              it('should return only the name as label if identification missing', () => {
                expect(
                  getAerodromeOption({
                    id: '3ADs5GZQxKbTk0of0qtS',
                    name: 'Winterthur',
                    timezone: 'Europe/Zurich'
                  })
                ).toEqual({
                  value: '3ADs5GZQxKbTk0of0qtS',
                  label: 'Winterthur'
                })
              })
            })

            describe('getAerodromeOptions', () => {
              it('should create the option objects for multiple aerodrome objects', () => {
                expect(
                  getAerodromeOptions([
                    {
                      id: '3ADs5GZQxKbTk0of0qtS',
                      name: 'Winterthur',
                      identification: 'LSPH',
                      timezone: 'Europe/Zurich'
                    },
                    {
                      id: '9ADs5GUGxKbTk0of0qta',
                      name: 'Lommis',
                      identification: 'LSZT',
                      timezone: 'Europe/Zurich'
                    }
                  ])
                ).toEqual([
                  {
                    value: '3ADs5GZQxKbTk0of0qtS',
                    label: 'Winterthur (LSPH)'
                  },
                  {
                    value: '9ADs5GUGxKbTk0of0qta',
                    label: 'Lommis (LSZT)'
                  }
                ])
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

            describe('getMemberOptions', () => {
              it('should create the option objects for multiple members', () => {
                expect(
                  getMemberOptions([
                    {
                      id: '3ADs5GZQxKbTk0of0qtS',
                      firstname: 'Max',
                      lastname: 'Muster'
                    },
                    {
                      id: '9ADs5GUGxKbTk0of0qta',
                      firstname: 'Hans',
                      lastname: 'Meier'
                    }
                  ])
                ).toEqual([
                  {
                    value: '3ADs5GZQxKbTk0of0qtS',
                    label: 'Muster Max'
                  },
                  {
                    value: '9ADs5GUGxKbTk0of0qta',
                    label: 'Meier Hans'
                  }
                ])
              })
            })
          })
        })
      })
    })
  })
})
