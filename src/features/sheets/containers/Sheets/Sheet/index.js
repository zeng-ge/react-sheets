import React from 'react'
import { connect } from 'react-redux'
import { some, map, reduce } from 'lodash'
import classnames from 'classnames'
import { Menu, Dropdown } from 'antd';
import { CaretDownOutlined, KeyOutlined } from '@ant-design/icons'
import Row from '../../../components/Row'
import AddFieldModal from '../../../containers/Sheets/modals/AddField'
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

  onShowAddFieldModal = (field, index) => () => {
    const { toggleAddFieldModalAction } = this.props
    const fieldIndex = index + 1;
    toggleAddFieldModalAction(fieldIndex)
  }

  onRemoveField = field => () => {
    const { table: { tableId }, removeFieldAction } = this.props
    removeFieldAction(tableId, field.id)
  }

  onPrivaryKey = field => () => {
    const { table: { tableId }, setFieldPrimaryAction } = this.props
    setFieldPrimaryAction(tableId, field.id)
  }

  onSelectField = (field, selected) => () => {
    const { table: { tableId }, selectFieldAction, deselectFieldAction} = this.props
    if(selected) {
      deselectFieldAction(tableId, field.id)
    } else {
      selectFieldAction(tableId, field.id)
    }
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

  getFieldMenu(field, index, selected) {
    return (
      <Menu>
        <Menu.Item onClick={this.onShowAddFieldModal(field, index)}>
          <span>新增字段</span>
        </Menu.Item>
        <Menu.Item onClick={this.onRemoveField(field)}>
          <span>删除字段</span>
        </Menu.Item>
        <Menu.Item onClick={this.onPrivaryKey(field)}>
          <span>设置为主字段</span>
        </Menu.Item>
        <Menu.Item onClick={this.onSelectField(field, selected)}>
          <span>{selected ? '取消选中' : '选中'}</span>
        </Menu.Item>
      </Menu>
    )
  }

  renderFieldMenu(field, index, selected){
    return (
      <Dropdown 
        overlay={this.getFieldMenu(field, index, selected)} 
        placement="bottomCenter" trigger="click">
          <CaretDownOutlined onClick={event => event.stopPropagation()}/>
      </Dropdown>
    )
  }

  renderHeader() {
    const { table: {fields = [], tableId} = {}, selectedFields} = this.props;
    return (
      <ul className="sheet-header" style={{width: this.calculateWidth()}}>
        { map(fields, (field, index) => {
          const isSelected = some(selectedFields, 
            item => item.tableId === tableId && item.fieldId === field.id)
          return (
            <li
              className={classnames('sheet-header-field', { 'selected-field': isSelected})} 
              style={{width: field.width}}
              key={field.id}>
                { field.primary && <KeyOutlined />}
                { field.name }
                { this.renderFieldMenu(field, index, isSelected) }
            </li>)
        })}
      </ul>
    )
  }
  
  renderRows() {
    const { table: { tableId, fields=[], rows =[]} = {} } = this.props;
    return map(rows, (row, index) => {
      return (
        <Row 
          className="sheet-row" 
          key={row.id} 
          fields={fields} 
          values={row}
          tableId={tableId}
          width={this.calculateWidth()}
          menu={this.getRowMenu(row.id, index)} />
      )
    })
  }

  render(){
    // const { table: { rows =[]} = {} } = this.props;
    const { addFieldModalVisibility } = this.props
    return (
      <div className="sheet-wrapper">
        { this.renderHeader() }
        <div className="sheet-body" >
          <div className="sheet-no"></div>
          <div className="sheet-rows">
            { this.renderRows() }
          </div>
        </div>
        { addFieldModalVisibility && <AddFieldModal />}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  selectedFields: state.sheets.selectedFields,
  addFieldModalVisibility: state.sheets.addFieldModalVisibility,
})
const mapDispatchToProps = {
  addRowAction: actions.createRow,
  deleteRowAction: actions.deleteRow,

  selectFieldAction: actions.selectField, 
  deselectFieldAction: actions.deselectField,

  addFieldAction: actions.addField,
  removeFieldAction: actions.removeField,
  setFieldPrimaryAction: actions.setFieldPrimary,
  toggleAddFieldModalAction: actions.toggleAddFieldModal
}
export default connect(mapStateToProps, mapDispatchToProps)(Sheet)