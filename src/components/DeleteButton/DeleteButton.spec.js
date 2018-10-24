import React from 'react'
import DeleteButton from './DeleteButton'
import renderer from 'react-test-renderer'

describe('components', () => {
  describe('DeleteButton', () => {
    it('renders correctly', () => {
      const tree = renderer
        .create(<DeleteButton label="Delete foobar" />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
