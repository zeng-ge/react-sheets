import React from 'react'
import { find } from 'lodash'

export default class Radio extends React.Component{
  render(){
    const { field: { options }, value } = this.props
    const option = find(options, item => item.value === value);
    return (
      <>
        <span>{option.name}</span>
      </>
    )
  }
}