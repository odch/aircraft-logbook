jest.mock('../components/FuelTypes')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import FuelTypes from '../components/FuelTypes'
import FuelTypesContainer from './FuelTypesContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('containers', () => {
              describe('FuelTypesContainer', () => {
                let wrapper
                let component

                beforeEach(() => {
                  jest.resetAllMocks()

                  const state = {
                    firebase: {
                      profile: {
                        selectedOrganization: 'org_id'
                      }
                    },
                    main: {
                      app: {
                        organizations: [{ id: 'org_id' }]
                      }
                    },
                    firestore: {
                      data: {
                        organizationAircrafts: {
                          o7flC7jw8jmkOfWo8oyA: {
                            registration: 'HBKFW',
                            settings: {
                              fuelTypes: [
                                { name: 'avgas', description: 'AvGas' },
                                { name: 'mogas', description: 'MoGas' }
                              ]
                            }
                          }
                        }
                      }
                    },
                    aircraftSettings: {
                      createFuelTypeDialog: {
                        open: false
                      }
                    }
                  }
                  const store = configureStore()(state)

                  const props = {
                    organizationId: 'org_id',
                    aircraftId: 'o7flC7jw8jmkOfWo8oyA'
                  }

                  wrapper = renderer.create(
                    <Provider store={store}>
                      <FuelTypesContainer {...props} />
                    </Provider>
                  )

                  component = wrapper.root.find(el => el.type === FuelTypes)
                })

                it('should render the component ', () => {
                  expect(component).toBeTruthy()
                })

                it('should map state to props', () => {
                  const expectedPropKeys = ['types']

                  expect(Object.keys(component.props)).toEqual(
                    expect.arrayContaining(expectedPropKeys)
                  )
                })

                it('should map dispatch to props', () => {
                  const expectedPropKeys = []

                  expect(Object.keys(component.props)).toEqual(
                    expect.arrayContaining(expectedPropKeys)
                  )
                })
              })
            })
          })
        })
      })
    })
  })
})
