import React from 'react'
import { map } from 'lodash'
import { Dropdown } from 'antd';
import Cell from '../Cell'

export default class Row extends React.Component{
  renderWithoutMenu(){
    const {tableId, fields, values, className} = this.props;
    return (
      <ul className={className} onMouseUp={event => event.stopPropagation()}>
        {
          map(fields, field => {
            const value = values[field.id]
            return <Cell key={field.id} field={field} tableId={tableId} rowId={values.id} value={value} />
          })
        }
      </ul>
    )
  }
  renderWithMenu(){
    const { values, menu } = this.props;
    return (
      <Dropdown 
        key={`dropdown-${values.id}`} 
        overlay={menu} 
        placement="bottomRight"
        trigger={["contextMenu"]}
      >
        {this.renderWithoutMenu()}
      </Dropdown>
    )
  }
  render(){
    const { menu } = this.props;
    return !!menu ? this.renderWithMenu() : this.renderWithoutMenu()
  }
}