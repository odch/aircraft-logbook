import React from 'react'
import Input from '@material-ui/core/Input'
import renderIntl from '../../../../testutil/renderIntl'
import RegistrationForm from './RegistrationForm'

function renderRegistrationForm(
  registrationForm = {
    data: {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    },
    failed: false,
    submitted: false
  },
  updateData = () => {},
  register = () => {}
) {
  return renderIntl(
    <RegistrationForm
      registrationForm={registrationForm}
      updateData={updateData}
      register={register}
    />
  )
}

describe('components', () => {
  describe('RegistrationForm', () => {
    it('renders correctly', () => {
      const registrationFormData = {
        data: {
          firstname: 'Max',
          lastname: 'Muster',
          email: 'test@example.com',
          password: 'mypassword'
        },
        failed: false,
        submitted: false
      }
      const tree = renderRegistrationForm(registrationFormData).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders error message if registration failed', () => {
      const registrationFormData = {
        data: {
          firstname: 'Max',
          lastname: 'Muster',
          email: 'test@example.com',
          password: ''
        },
        failed: true,
        submitted: false
      }
      const tree = renderRegistrationForm(registrationFormData).toJSON()
      expect(tree).toMatchSnapshot()
    })

    const updateDataTest = (name, value) => {
      const updateData = jest.fn()

      const component = renderRegistrationForm(undefined, updateData)

      const input = component.root.find(
        el => el.type === Input && el.props.name === name
      )
      input.props.onChange({
        target: { value }
      })
      expect(updateData).toHaveBeenCalledWith({
        [name]: value
      })
    }

    it('calls updateData function on firstname change', () => {
      updateDataTest('firstname', 'Max')
    })

    it('calls updateData function on lastname change', () => {
      updateDataTest('lastname', 'Muster')
    })

    it('calls updateData function on email change', () => {
      updateDataTest('email', 'test@example.com')
    })

    it('calls updateData function on password change', () => {
      updateDataTest('password', 'mytestpassword')
    })

    it('calls register function on submit', () => {
      const registrationFormData = {
        data: {
          firstname: 'Max',
          lastname: 'Muster',
          email: 'test@example.com',
          password: 'mypassword'
        },
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
        register
      )

      const form = component.root.find(el => el.type === 'form')

      form.props.onSubmit(e)

      expect(e.preventDefault).toHaveBeenCalled()
      expect(register).toHaveBeenCalledWith({
        firstname: 'Max',
        lastname: 'Muster',
        email: 'test@example.com',
        password: 'mypassword'
      })
    })
  })
})
