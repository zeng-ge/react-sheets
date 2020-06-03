import React from 'react'
import { debounce } from 'lodash'

export default class Text extends React.Component{

  constructor(props){
    super(props)
    this.inputRef = null
  }

  onTextChange = event => {
    this.onChange(event.target.value)
  }

  onChange = debounce(value => {
    const { onChange } = this.props
    onChange(value)
  }, 300)

  onEdit = () => {
    const { onEdit }= this.props
    onEdit()
  }

  onEnter = event => {
    const ENTER_KEY_CODE = 13;
    if(event.keyCode === ENTER_KEY_CODE){
      const { onResetEditMode } = this.props
      onResetEditMode && onResetEditMode()
    }
  }

  renderInput() {
    const { value } = this.props
    return (
      <input ref={input => {
        this.inputRef = input
        input && input.focus()
      }} defaultValue={value} onChange={this.onTextChange} onKeyUp={this.onEnter}/>
    )
  }
  
  renderText() {
    const { value } = this.props
    return <span className="cell-content" onDoubleClick={this.onEdit}>{value}</span>
  }

  render(){
    const { readonly = true } = this.props
    return readonly ? this.renderText() : this.renderInput()
  }
}