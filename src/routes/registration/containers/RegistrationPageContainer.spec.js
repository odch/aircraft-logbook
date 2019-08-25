jest.mock('../components/RegistrationPage')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import RegistrationPage from '../components/RegistrationPage'
import RegistrationPageContainer from './RegistrationPageContainer'

describe('containers', () => {
  describe('RegistrationPageContainer', () => {
    let wrapper
    let component

    beforeEach(() => {
      jest.resetAllMocks()

      const store = configureStore()({
        firebase: {
          auth: {}
        }
      })

      wrapper = renderer.create(
        <Provider store={store}>
          <RegistrationPageContainer />
        </Provider>
      )

      component = wrapper.root.find(el => el.type === RegistrationPage)
    })

    it('should render the component ', () => {
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
