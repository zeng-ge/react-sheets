import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { some } from 'lodash'
import Text from '../../../../components/form/Text'
import Radio from '../../../../components/form/Radio'
import { upperCase } from 'lodash'

import { typesMap } from '../../../../constants/cells'
import './index.scss'
import actions from '../../actions'

const formFieldMap = {
  [typesMap.TEXT]: Text,
  [typesMap.RADIO]: Radio
}

export class Cell extends React.Component{
  onChange = value => {
    const { tableId, rowId, field, updateRowCell } = this.props
    updateRowCell(tableId, rowId, field.id, value)
  }

  onEdit = () => {
    const { tableId, rowId, field, setEditCell } = this.props
    setEditCell(tableId, rowId, field.id)
  }

  onResetEditMode = () => {
    const { setEditCell } = this.props
    setEditCell()
  }

  isMatchedCell(cell) {
    const { field, tableId, rowId } = this.props
    return !!cell && cell.tableId === tableId 
                && cell.rowId === rowId 
                && cell.fieldId === field.id;
  }

  shouldComponentUpdate(nextProps) {
    const { field, value, tableId, rowId, selectedFields, editCell } = this.props
    const nextSelectedFields = nextProps.selectedFields
    const nextEditCell = nextProps.editCell
    const simpleValuesChanged = value !== nextProps.value 
            || tableId !== nextProps.tableId
            || rowId !== nextProps.rowId
            || field !== nextProps.field

    const matchField = item => item.tableId === tableId
                              && item.fieldId === field.id;
    const seletedChanged = some(selectedFields, matchField) 
                            !== some(nextSelectedFields, matchField)
    const editModeChange = this.isMatchedCell(nextEditCell) !== this.isMatchedCell(editCell)

    return simpleValuesChanged || seletedChanged || editModeChange
  }

  render(){
    const { tableId, field, value, editCell, selectedFields } = this.props
    const type = upperCase(field.type)
    const FieldComponent = formFieldMap[type]
    const editable = this.isMatchedCell(editCell)
    const isFieldSelected = some(selectedFields, item => {
      return item.tableId === tableId && item.fieldId === field.id
    })
    return (
      <li className={classnames('cell-container', { 'selected-field': isFieldSelected })} style={{ width: field.width }}>
        <FieldComponent
          field={field} 
          value={value} 
          readonly={!editable}
          onResetEditMode={this.onResetEditMode}
          onChange={this.onChange}
          onEdit={this.onEdit} />
      </li>
    )
  }
}

const mapStateToProps = state => ({
  editCell: state.sheets.editCell,
  selectedFields: state.sheets.selectedFields
})
const mapDispatchToProps = {
  setEditCell: actions.setEditCell,
  updateRowCell: actions.updateRowCell
}
export default connect(mapStateToProps, mapDispatchToProps)(Cell)
