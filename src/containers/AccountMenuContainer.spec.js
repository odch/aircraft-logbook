jest.mock('../components/AccountMenu')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import AccountMenu from '../components/AccountMenu'
import AccountMenuContainer from './AccountMenuContainer'

describe('containers', () => {
  describe('AccountMenuContainer', () => {
    let wrapper
    let component
    let container

    beforeEach(() => {
      jest.resetAllMocks()

      const store = configureStore()({
        firebase: {
          auth: {},
          profile: {
            selectedOrganization: 'my_org'
          }
        },
        firestore: {
          data: {
            organizations: {
              my_org: {}
            }
          }
        }
      })

      wrapper = renderer.create(
        <Provider store={store}>
          <AccountMenuContainer />
        </Provider>
      )

      container = wrapper.root.find(el => el.type === AccountMenuContainer)
      component = container.find(el => el.type === AccountMenu)
    })

    it('should render both the container and the component ', () => {
      expect(container).toBeTruthy()
      expect(component).toBeTruthy()
    })

    it('should map state and own props to props', () => {
      const expectedPropKeys = [
        'auth',
        'open',
        'anchorEl',
        'onClose',
        'selectedOrganizationId',
        'organization'
      ]

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = ['logout']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
