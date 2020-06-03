import React from 'react'
import { Select } from 'antd'
import { find, map } from 'lodash'

const Option = Select.Option
export default class Radio extends React.Component{

  onChange = value => {
    const { onChange } = this.props
    onChange(value)
  }

  onEdit = () => {
    const { onEdit }= this.props
    onEdit()
  }

  renderOptions() {
    const { field: { options }, value } = this.props
    return (
      <Select onChange={this.onChange} value={value}>
        {
          map(options, option => {
            return <Option key={option.value} value={option.value}>{option.name}</Option>
          })
        }
      </Select>
    )
  }
  
  renderText() {
    const { field: { options }, value } = this.props
    let option = find(options, item => item.value === value);
    return <span className="cell-content" onDoubleClick={this.onEdit}>{option && option.name}</span>
  }

  render(){
    const { readonly = true } = this.props
    return readonly ? this.renderText() : this.renderOptions()
  }
}