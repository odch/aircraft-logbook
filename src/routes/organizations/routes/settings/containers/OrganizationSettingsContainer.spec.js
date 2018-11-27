jest.mock('../components/OrganizationSettings')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import OrganizationSettings from '../components/OrganizationSettings'
import OrganizationSettingsContainer from './OrganizationSettingsContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('containers', () => {
          describe('OrganizationSettingsContainer', () => {
            let wrapper
            let component
            let container

            beforeEach(() => {
              jest.resetAllMocks()

              const state = {
                firebase: {},
                main: {
                  app: {
                    organizations: [{ id: 'my_org' }]
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
                  <OrganizationSettingsContainer {...props} />
                </Provider>
              )

              container = wrapper.root.find(
                el => el.type === OrganizationSettingsContainer
              )
              component = container.find(el => el.type === OrganizationSettings)
            })

            it('should render both the container and the component ', () => {
              expect(container).toBeTruthy()
              expect(component).toBeTruthy()
            })

            it('should map state to props', () => {
              const expectedPropKeys = ['match', 'organization']

              expect(Object.keys(component.props)).toEqual(
                expect.arrayContaining(expectedPropKeys)
              )
            })

            it('should map dispatch to props', () => {
              const expectedPropKeys = ['deleteOrganization']

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
