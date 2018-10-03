import React from 'react'
import Input from '@material-ui/core/Input'
import renderIntl from '../../testutil/renderIntl'
import LoginForm from './LoginForm'

function renderLoginForm(
  loginForm = { username: '', password: '', failed: false, submitted: false },
  setUsername = () => {},
  setPassword = () => {},
  login = () => {}
) {
  return renderIntl(
    <LoginForm
      loginForm={loginForm}
      setUsername={setUsername}
      setPassword={setPassword}
      login={login}
    />
  )
}

describe('components', () => {
  describe('LoginForm', () => {
    it('renders correctly', () => {
      const loginFormData = {
        username: 'test@example.com',
        password: 'mypassword',
        failed: false,
        submitted: false
      }
      const tree = renderLoginForm(loginFormData).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders error message if login failed', () => {
      const loginFormData = {
        username: 'test@example.com',
        password: '',
        failed: true,
        submitted: false
      }
      const tree = renderLoginForm(loginFormData).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('calls setUsername function', () => {
      const setUsername = jest.fn()

      const component = renderLoginForm(undefined, setUsername)

      const usernameInput = component.root.find(
        el => el.type === Input && el.props.name === 'email'
      )
      usernameInput.props.onChange({
        target: { value: 'test@example.com' }
      })
      expect(setUsername).toHaveBeenCalledWith('test@example.com')
    })

    it('calls setPassword function', () => {
      const setPassword = jest.fn()

      const component = renderLoginForm(undefined, undefined, setPassword)

      const usernameInput = component.root.find(
        el => el.type === Input && el.props.name === 'password'
      )
      usernameInput.props.onChange({
        target: { value: 'mytestpassword' }
      })
      expect(setPassword).toHaveBeenCalledWith('mytestpassword')
    })

    it('calls login function on submit', () => {
      const loginFormData = {
        username: 'test@example.com',
        password: 'mypassword',
        failed: false,
        submitted: false
      }
      const login = jest.fn()
      const e = {
        preventDefault: jest.fn().mockReturnThis()
      }

      const component = renderLoginForm(
        loginFormData,
        undefined,
        undefined,
        login
      )

      const form = component.root.find(el => el.type === 'form')

      form.props.onSubmit(e)

      expect(e.preventDefault).toHaveBeenCalled()
      expect(login).toHaveBeenCalledWith('test@example.com', 'mypassword')
    })
  })
})
