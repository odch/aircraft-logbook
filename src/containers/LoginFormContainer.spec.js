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
    let container

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

      container = wrapper.root.find(el => el.type === LoginFormContainer)
      component = container.find(el => el.type === LoginForm)
    })

    it('should render both the container and the component ', () => {
      expect(container).toBeTruthy()
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
