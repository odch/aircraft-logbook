import React from 'react'
import renderer from 'react-test-renderer'
import Title from './Title'

describe('components', () => {
  describe('Title', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<Title text="test title" />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
