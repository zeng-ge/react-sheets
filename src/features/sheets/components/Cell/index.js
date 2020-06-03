import React from 'react'
import Text from '../../../../components/form/Text'
import Radio from '../../../../components/form/Radio'
import { upperCase } from 'lodash'

import { typesMap } from '../../../../constants/cells'
import './index.scss'

const formFieldMap = {
  [typesMap.TEXT]: Text,
  [typesMap.RADIO]: Radio
}

export default class Cell extends React.Component{
  render(){
    const { field, value } = this.props
    const type = upperCase(field.type)
    const FieldComponent = formFieldMap[type]
    return (
      <li className="cell-container" style={{ width: field.width }}>
        <FieldComponent field={field} value={value} />
      </li>
    )
  }
}