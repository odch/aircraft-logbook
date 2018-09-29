jest.mock('../components/App')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import App from '../components/App'
import AppContainer from './AppContainer'

describe('containers', () => {
  describe('AppContainer', () => {
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
          <AppContainer />
        </Provider>
      )

      container = wrapper.root.find(el => el.type === AppContainer)
      component = container.find(el => el.type === App)
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
