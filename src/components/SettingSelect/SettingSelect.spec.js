import React from 'react'
import renderIntl from '../../testutil/renderIntl'
import SettingSelect from './SettingSelect'

describe('components', () => {
  describe('SettingSelect', () => {
    it('renders correctly without value', () => {
      const tree = renderIntl(
        <SettingSelect
          label="My test select"
          options={[
            { value: 'value1', label: 'Value 1' },
            { value: 'value2', label: 'Value 2' },
            { value: 'value3', label: 'Value 3' }
          ]}
          onChange={() => {}}
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders correctly with value', () => {
      const tree = renderIntl(
        <SettingSelect
          label="My test select"
          value="value2"
          options={[
            { value: 'value1', label: 'Value 1' },
            { value: 'value2', label: 'Value 2' },
            { value: 'value3', label: 'Value 3' }
          ]}
          onChange={() => {}}
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders readonly with loading indicator when submitting', () => {
      const tree = renderIntl(
        <SettingSelect
          label="My test select"
          value="value2"
          options={[
            { value: 'value1', label: 'Value 1' },
            { value: 'value2', label: 'Value 2' },
            { value: 'value3', label: 'Value 3' }
          ]}
          onChange={() => {}}
          submitting
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
