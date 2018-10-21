jest.mock('../components/OrganizationDetail')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import OrganizationDetail from '../components/OrganizationDetail'
import OrganizationDetailContainer from './OrganizationDetailContainer'

describe('containers', () => {
  describe('OrganizationDetailContainer', () => {
    let wrapper
    let component
    let container

    beforeEach(() => {
      jest.resetAllMocks()

      const state = {
        firebase: {},
        firestore: {
          data: {
            organizations: {
              my_org: {}
            }
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

      container = wrapper.root.find(
        el => el.type === OrganizationDetailContainer
      )
      component = container.find(el => el.type === OrganizationDetail)
    })

    it('should render both the container and the component ', () => {
      expect(container).toBeTruthy()
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = ['match', 'organizationId', 'organization']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = ['loadOrganization']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
