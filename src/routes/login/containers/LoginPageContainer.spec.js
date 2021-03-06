jest.mock('../components/LoginPage')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import LoginPage from '../components/LoginPage'
import LoginPageContainer from './LoginPageContainer'

describe('containers', () => {
  describe('LoginPageContainer', () => {
    let wrapper
    let component

    beforeEach(() => {
      jest.resetAllMocks()

      const store = configureStore()({
        firebase: {
          auth: {}
        },
        login: {
          tokenLogin: {}
        }
      })

      wrapper = renderer.create(
        <Provider store={store}>
          <LoginPageContainer />
        </Provider>
      )

      component = wrapper.root.find(el => el.type === LoginPage)
    })

    it('should render the component ', () => {
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = ['auth', 'tokenLogin']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = ['loginWithToken']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
