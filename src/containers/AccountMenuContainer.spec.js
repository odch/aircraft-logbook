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

    beforeEach(() => {
      jest.resetAllMocks()

      const store = configureStore()({
        firebase: {
          auth: {},
          profile: {
            selectedOrganization: 'my_org'
          }
        },
        main: {
          app: {
            organizations: [{ id: 'my_org' }]
          }
        }
      })

      wrapper = renderer.create(
        <Provider store={store}>
          <AccountMenuContainer />
        </Provider>
      )

      component = wrapper.root.find(el => el.type === AccountMenu)
    })

    it('should render the component ', () => {
      expect(component).toBeTruthy()
    })

    it('should map state and own props to props', () => {
      const expectedPropKeys = [
        'auth',
        'open',
        'anchorEl',
        'onClose',
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
