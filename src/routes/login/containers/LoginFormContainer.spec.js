jest.mock('../components/LoginForm')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import LoginForm from '../components/LoginForm'
import LoginFormContainer from './LoginFormContainer'

describe('containers', () => {
  describe('LoginFormContainer', () => {
    let wrapper
    let component

    beforeEach(() => {
      jest.resetAllMocks()

      const store = configureStore()({
        app: {
          login: {}
        }
      })

      wrapper = renderer.create(
        <Provider store={store}>
          <LoginFormContainer />
        </Provider>
      )

      component = wrapper.root.find(el => el.type === LoginForm)
    })

    it('should render the component ', () => {
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = ['loginForm']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = [
        'setUsername',
        'setPassword',
        'login',
        'setSubmitted'
      ]

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
