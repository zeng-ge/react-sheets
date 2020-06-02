import React from 'react'
import { map } from 'lodash'
import Cell from '../Cell'

export default class Row extends React.Component{
  render(){
    const {fields, values} = this.props;
    return (
      <ul>
        {
          map(fields, field => {
            const value = values[field.id]
            return <Cell key={field.id} field={field} value={value} />
          })
        }
      </ul>
    )
  }
}