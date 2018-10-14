import React from 'react'
import renderer from 'react-test-renderer'
import LoadingIcon from './LoadingIcon'

describe('components', () => {
  describe('LoadingIcon', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<LoadingIcon />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
