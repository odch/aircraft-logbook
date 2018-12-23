jest.mock('../components/FlightCreateDialog')

import React from 'react'
import renderIntl from '../../../../../testutil/renderIntl'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import FlightCreateDialog from '../components/FlightCreateDialog'
import FlightCreateDialogContainer from './FlightCreateDialogContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('containers', () => {
          describe('FlightCreateDialogContainer', () => {
            let wrapper
            let component
            let container

            beforeEach(() => {
              jest.resetAllMocks()

              const state = {
                firestore: {
                  ordered: {}
                },
                aircraft: {
                  createFlightDialogData: {}
                }
              }
              const store = configureStore()(state)

              wrapper = renderIntl(
                <Provider store={store}>
                  <FlightCreateDialogContainer />
                </Provider>
              )

              container = wrapper.root.find(
                el => el.type === FlightCreateDialogContainer
              )
              component = container.find(el => el.type === FlightCreateDialog)
            })

            it('should render both the container and the component ', () => {
              expect(container).toBeTruthy()
              expect(component).toBeTruthy()
            })

            it('should map state to props', () => {
              const expectedPropKeys = [
                'organizationMembers',
                'flightNatures',
                'aerodromes',
                'data'
              ]

              expect(Object.keys(component.props)).toEqual(
                expect.arrayContaining(expectedPropKeys)
              )
            })

            it('should map dispatch to props', () => {
              const expectedPropKeys = ['onClose', 'updateData', 'onSubmit']

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
