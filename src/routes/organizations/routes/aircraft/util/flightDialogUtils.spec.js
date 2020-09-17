import {
  loadAerodromes,
  loadMembers,
  loadInstructors
} from './flightDialogUtils'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('util', () => {
          describe('flightDialogUtils', () => {
            describe('loadMembers', () => {
              const state = {
                firestore: {
                  ordered: {
                    organizationMembers: [
                      {
                        id: '1',
                        lastname: 'Keller',
                        firstname: 'Stefan',
                        nr: '23244'
                      },
                      {
                        id: '2',
                        lastname: 'Meier',
                        firstname: 'Hans',
                        nr: '33492'
                      },
                      {
                        id: '3',
                        lastname: 'Meierhans',
                        firstname: 'Heinz',
                        nr: '33491'
                      }
                    ]
                  }
                }
              }

              it('should match on lastname', () => {
                const callback = jest.fn()
                loadMembers(state)('mei', callback)
                expect(callback).toHaveBeenCalledWith([
                  {
                    value: '2',
                    label: 'Meier Hans'
                  },
                  {
                    value: '3',
                    label: 'Meierhans Heinz'
                  }
                ])
              })

              it('should match on firstname', () => {
                const callback = jest.fn()
                loadMembers(state)('efa', callback)
                expect(callback).toHaveBeenCalledWith([
                  {
                    value: '1',
                    label: 'Keller Stefan'
                  }
                ])
              })

              it('should match on nr', () => {
                const callback = jest.fn()
                loadMembers(state)('23244', callback)
                expect(callback).toHaveBeenCalledWith([
                  {
                    value: '1',
                    label: 'Keller Stefan'
                  }
                ])
              })

              it('should callback with empty array if no match', () => {
                const callback = jest.fn()
                loadMembers(state)('asdfjklöfas', callback)
                expect(callback).toHaveBeenCalledWith([])
              })
            })

            describe('loadInstructors', () => {
              const state = {
                firestore: {
                  ordered: {
                    organizationMembers: [
                      {
                        id: '2',
                        lastname: 'Meier',
                        firstname: 'Hans',
                        nr: '33492',
                        instructor: true
                      },
                      {
                        id: '3',
                        lastname: 'Meierhans',
                        firstname: 'Heinz',
                        nr: '33491'
                      }
                    ]
                  }
                }
              }

              it('should return instructors only', () => {
                const callback = jest.fn()
                loadInstructors(state)('mei', callback)
                expect(callback).toHaveBeenCalledWith([
                  {
                    value: '2',
                    label: 'Meier Hans'
                  }
                ])
              })
            })

            describe('loadAeorodromes', () => {
              const state = {
                firestore: {
                  ordered: {
                    allAerodromes: [
                      {
                        id: '1',
                        name: 'Lommis',
                        identification: 'LSZT'
                      },
                      {
                        id: '2',
                        name: 'Wangen-Lachen',
                        identification: 'LSPV'
                      }
                    ],
                    organizationAerodromes: [
                      {
                        id: '3',
                        name: 'Hagenbuch',
                        identification: 'LSZZ'
                      },
                      {
                        id: '4',
                        name: 'Alommalo', // random fantasy name
                        identification: 'I99'
                      }
                    ]
                  }
                }
              }

              it('should match on name', () => {
                const callback = jest.fn()
                loadAerodromes(state)('lom', callback)
                expect(callback).toHaveBeenCalledWith([
                  {
                    value: '4',
                    label: 'I99 (Alommalo)'
                  },
                  {
                    value: '1',
                    label: 'LSZT (Lommis)'
                  }
                ])
              })

              it('should match on identification', () => {
                const callback = jest.fn()
                loadAerodromes(state)('LSZ', callback)
                expect(callback).toHaveBeenCalledWith([
                  {
                    value: '3',
                    label: 'LSZZ (Hagenbuch)'
                  },
                  {
                    value: '1',
                    label: 'LSZT (Lommis)'
                  }
                ])
              })

              it('should callback with empty array if no match', () => {
                const callback = jest.fn()
                loadAerodromes(state)('asdfjklöfas', callback)
                expect(callback).toHaveBeenCalledWith([])
              })
            })
          })
        })
      })
    })
  })
})
