import React from 'react'
import { connect } from 'react-redux'
import { map, reduce } from 'lodash'
import { Menu, Dropdown } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons'
import Row from '../../../../../components/Row'
import actions from '../../../actions'
import './index.scss'

export class Sheet extends React.Component{

  calculateWidth() {
    const { table: {fields = []} = {} } = this.props;
    return reduce(fields, (accumulator, field)=> {
      return accumulator += field.width;
    }, 0)
  }

  onAddRow = index => () => {
    const { table, addRowAction } = this.props;
    const nextRowIndex = index + 1;
    addRowAction(table.tableId, nextRowIndex)
  }

  onRemoveRow = rowId => () => {
    const { table, deleteRowAction } = this.props;
    deleteRowAction(table.tableId, rowId)
  }

  onAddField = field => () => {

  }

  onRemoveField = field => () => {

  }

  onPrivaryKey = field => () => {

  }

  onSelectField = field => () => {

  }

  getRowMenu = (rowId, index) => {
    return (
      <Menu>
        <Menu.Item onClick={this.onAddRow(index)}>
          <span>新增记录</span>
        </Menu.Item>
        <Menu.Item onClick={this.onRemoveRow(rowId)}>
          <span>删除记录</span>
        </Menu.Item>
      </Menu>
    )
  }

  getFieldMenu(field) {
    return (
      <Menu>
        <Menu.Item onClick={this.onAddField(field)}>
          <span>新增字段</span>
        </Menu.Item>
        <Menu.Item onClick={this.onRemoveField(field)}>
          <span>删除字段</span>
        </Menu.Item>
        <Menu.Item onClick={this.onPrivaryKey(field)}>
          <span>设置为主字段</span>
        </Menu.Item>
        <Menu.Item onClick={this.onSelectField(field)}>
          <span>选中</span>
        </Menu.Item>
      </Menu>
    )
  }

  renderFieldMenu(field){
    return (
      <Dropdown 
        overlay={this.getFieldMenu(field)} 
        placement="bottomCenter" trigger="click">
          <CaretDownOutlined onClick={event => event.stopPropagation()}/>
      </Dropdown>
    )
  }

  renderHeader() {
    const { table: {fields = []} = {} } = this.props;
    return (
      <ul className="sheet-header" style={{width: this.calculateWidth()}}>
        { map(fields, field => {
          return (
            <li
              className="sheet-header-field" 
              style={{width: field.width}}
              key={field.id}>
                { field.name }
                { this.renderFieldMenu(field) }
            </li>)
        })}
      </ul>
    )
  }
  
  renderRows() {
    const { table: { fields=[], rows =[]} = {} } = this.props;
    return map(rows, (row, index) => {
      return (
        <Row 
          className="sheet-row" 
          key={row.id} 
          fields={fields} 
          values={row} 
          menu={this.getRowMenu(row.id, index)} />
      )
    })
  }

  render(){
    // const { table: { rows =[]} = {} } = this.props;
    return (
      <div className="sheet-wrapper">
        { this.renderHeader() }
        <div className="sheet-body" style={{width: this.calculateWidth()}}>
          <div className="sheet-no"></div>
          <div className="sheet-rows">
            { this.renderRows() }
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({})
const mapDispatchToProps = {
  addRowAction: actions.createRow,
  deleteRowAction: actions.deleteRow
}
export default connect(mapStateToProps, mapDispatchToProps)(Sheet)