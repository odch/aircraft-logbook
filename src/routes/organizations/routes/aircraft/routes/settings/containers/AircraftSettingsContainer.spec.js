jest.mock('../components/AircraftSettings')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import AircraftSettings from '../components/AircraftSettings'
import AircraftSettingsContainer from './AircraftSettingsContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('containers', () => {
              describe('AircraftSettingsContainer', () => {
                let wrapper
                let component

                beforeEach(() => {
                  jest.resetAllMocks()

                  const state = {
                    firebase: {
                      profile: {
                        selectedOrganization: 'my_org'
                      }
                    },
                    main: {
                      app: {
                        organizations: [{ id: 'my_org' }]
                      }
                    },
                    firestore: {
                      data: {
                        organizationAircrafts: {
                          o7flC7jw8jmkOfWo8oyA: {
                            registration: 'HBKFW'
                          },
                          BKi7HYAIoe1i75H3LMk1: {
                            registration: 'HBKOF'
                          }
                        }
                      }
                    },
                    aircraftSettings: {
                      deleteAircraftDialog: {
                        open: false
                      }
                    }
                  }
                  const store = configureStore()(state)

                  const props = {
                    match: {
                      params: {
                        organizationId: 'my_org',
                        aircraftId: 'o7flC7jw8jmkOfWo8oyA'
                      }
                    }
                  }

                  wrapper = renderer.create(
                    <Provider store={store}>
                      <AircraftSettingsContainer {...props} />
                    </Provider>
                  )

                  component = wrapper.root.find(
                    el => el.type === AircraftSettings
                  )
                })

                it('should render the component ', () => {
                  expect(component).toBeTruthy()
                })

                it('should map state to props', () => {
                  const expectedPropKeys = ['match', 'organization', 'aircraft']

                  expect(Object.keys(component.props)).toEqual(
                    expect.arrayContaining(expectedPropKeys)
                  )
                })

                it('should map dispatch to props', () => {
                  const expectedPropKeys = ['fetchAircrafts']

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
