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

      component = wrapper.root.find(el => el.type === RegistrationForm)
    })

    it('should render the component ', () => {
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = ['registrationForm']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = ['updateData', 'register', 'setSubmitted']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
