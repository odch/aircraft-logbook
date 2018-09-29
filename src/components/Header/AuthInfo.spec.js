import React from 'react'
import renderer from 'react-test-renderer'
import AuthInfo from './AuthInfo'

describe('components', () => {
  describe('Header', () => {
    describe('AuthInfo', () => {
      it('renders correctly', () => {
        const tree = renderer
          .create(<AuthInfo username="test@example.com" />)
          .toJSON()
        expect(tree).toMatchSnapshot()
      })
    })
  })
})
