import React from 'react'
import { connect } from 'react-redux'
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

  render(){
    const { field, value, tableId, rowId, editCell } = this.props
    const type = upperCase(field.type)
    const FieldComponent = formFieldMap[type]
    const editable = editCell && editCell.tableId === tableId 
      && editCell.rowId === rowId 
      && editCell.fieldId === field.id; 
    return (
      <li className="cell-container" style={{ width: field.width }}>
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
  editCell: state.sheets.editCell
})
const mapDispatchToProps = {
  setEditCell: actions.setEditCell,
  updateRowCell: actions.updateRowCell
}
export default connect(mapStateToProps, mapDispatchToProps)(Cell)
