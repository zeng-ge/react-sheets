import React from 'react'

export default class Text extends React.Component{
  render(){
    const { value } = this.props
    return (
      <>
        <span>{value}</span>
      </>
    )
  }
}