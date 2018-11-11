import React from 'react'
import Input from '@material-ui/core/Input'
import renderIntl from '../../../../testutil/renderIntl'
import RegistrationForm from './RegistrationForm'

function renderRegistrationForm(
  registrationForm = {
    email: '',
    password: '',
    failed: false,
    submitted: false
  },
  setEmail = () => {},
  setPassword = () => {},
  register = () => {}
) {
  return renderIntl(
    <RegistrationForm
      registrationForm={registrationForm}
      setEmail={setEmail}
      setPassword={setPassword}
      register={register}
    />
  )
}

describe('components', () => {
  describe('RegistrationForm', () => {
    it('renders correctly', () => {
      const registrationFormData = {
        email: 'test@example.com',
        password: 'mypassword',
        failed: false,
        submitted: false
      }
      const tree = renderRegistrationForm(registrationFormData).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders error message if registration failed', () => {
      const registrationFormData = {
        email: 'test@example.com',
        password: '',
        failed: true,
        submitted: false
      }
      const tree = renderRegistrationForm(registrationFormData).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('calls setEmail function', () => {
      const setEmail = jest.fn()

      const component = renderRegistrationForm(undefined, setEmail)

      const usernameInput = component.root.find(
        el => el.type === Input && el.props.name === 'email'
      )
      usernameInput.props.onChange({
        target: { value: 'test@example.com' }
      })
      expect(setEmail).toHaveBeenCalledWith('test@example.com')
    })

    it('calls setPassword function', () => {
      const setPassword = jest.fn()

      const component = renderRegistrationForm(
        undefined,
        undefined,
        setPassword
      )

      const usernameInput = component.root.find(
        el => el.type === Input && el.props.name === 'password'
      )
      usernameInput.props.onChange({
        target: { value: 'mytestpassword' }
      })
      expect(setPassword).toHaveBeenCalledWith('mytestpassword')
    })

    it('calls register function on submit', () => {
      const registrationFormData = {
        email: 'test@example.com',
        password: 'mypassword',
        failed: false,
        submitted: false
      }
      const register = jest.fn()
      const e = {
        preventDefault: jest.fn().mockReturnThis()
      }

      const component = renderRegistrationForm(
        registrationFormData,
        undefined,
        undefined,
        register
      )

      const form = component.root.find(el => el.type === 'form')

      form.props.onSubmit(e)

      expect(e.preventDefault).toHaveBeenCalled()
      expect(register).toHaveBeenCalledWith('test@example.com', 'mypassword')
    })
  })
})
