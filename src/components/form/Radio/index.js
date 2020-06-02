import React from 'react'
import { find } from 'lodash'

export default class Radio extends React.Component{
  render(){
    const { field: { options }, value } = this.props
    let option = find(options, item => item.value === value);
    if(!option) {
      option = find(options, option => option.isDefault)
    }
    return (
      <>
        <span>{option.name}</span>
      </>
    )
  }
}