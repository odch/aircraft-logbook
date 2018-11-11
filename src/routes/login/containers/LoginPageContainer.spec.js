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
    let container

    beforeEach(() => {
      jest.resetAllMocks()

      const store = configureStore()({
        firebase: {
          auth: {}
        }
      })

      wrapper = renderer.create(
        <Provider store={store}>
          <LoginPageContainer />
        </Provider>
      )

      container = wrapper.root.find(el => el.type === LoginPageContainer)
      component = container.find(el => el.type === LoginPage)
    })

    it('should render both the container and the component ', () => {
      expect(container).toBeTruthy()
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = ['auth']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = []

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
