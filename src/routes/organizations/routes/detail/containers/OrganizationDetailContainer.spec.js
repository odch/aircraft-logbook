jest.mock('../components/OrganizationDetail')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import OrganizationDetail from '../components/OrganizationDetail'
import OrganizationDetailContainer from './OrganizationDetailContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('containers', () => {
          describe('OrganizationDetailContainer', () => {
            let wrapper
            let component

            beforeEach(() => {
              jest.resetAllMocks()

              const state = {
                firebase: {
                  auth: {
                    isLoaded: true,
                    isEmpty: false,
                    email: 'test@opendigital.ch'
                  }
                },
                main: {
                  app: {
                    organizations: [{ id: 'my_org' }]
                  }
                },
                firestore: {
                  ordered: {
                    organizationAircrafts: [
                      {
                        registration: 'HBKFW'
                      },
                      {
                        registration: 'HBKOF'
                      }
                    ]
                  }
                },
                organizationDetail: {
                  createAircraftDialog: {
                    open: false
                  }
                }
              }
              const store = configureStore()(state)

              const props = {
                match: {
                  params: {
                    organizationId: 'my_org'
                  }
                }
              }

              wrapper = renderer.create(
                <Provider store={store}>
                  <OrganizationDetailContainer {...props} />
                </Provider>
              )

              component = wrapper.root.find(
                el => el.type === OrganizationDetail
              )
            })

            it('should render the component ', () => {
              expect(component).toBeTruthy()
            })

            it('should map state to props', () => {
              const expectedPropKeys = ['match', 'organization']

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
