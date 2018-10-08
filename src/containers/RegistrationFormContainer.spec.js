jest.mock('../components/RegistrationForm')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import RegistrationForm from '../components/RegistrationForm'
import RegistrationFormContainer from './RegistrationFormContainer'

describe('containers', () => {
  describe('RegistrationFormContainer', () => {
    let wrapper
    let component
    let container

    beforeEach(() => {
      jest.resetAllMocks()

      const store = configureStore()({
        app: {
          registration: {}
        }
      })

      wrapper = renderer.create(
        <Provider store={store}>
          <RegistrationFormContainer />
        </Provider>
      )

      container = wrapper.root.find(el => el.type === RegistrationFormContainer)
      component = container.find(el => el.type === RegistrationForm)
    })

    it('should render both the container and the component ', () => {
      expect(container).toBeTruthy()
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = ['registrationForm']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = [
        'setEmail',
        'setPassword',
        'register',
        'setSubmitted'
      ]

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
