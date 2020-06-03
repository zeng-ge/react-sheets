import React from 'react'
import { connect } from 'react-redux'
import { Modal, Select } from 'antd'
import { trim } from 'lodash'
import actions from '../../../../actions'
import { selectedFieldsSelector } from '../../../../selectors'

const Option = Select.Option
export class CreateTableModal extends React.Component{
  constructor(props){
    super(props)  
    this.inputRef = React.createRef()
    this.state = { primaryFieldId: undefined }
  }

  onChangeField = fieldId => {
    this.setState({ primaryFieldId: fieldId })
  }

  onCancel = () => {
    const { toggleModal } = this.props
    toggleModal()
  }

  onOk = () => {
    const { confirmAction, toggleModal, isUpdate, tableId, selectedFields, resetSelectFieldAction } = this.props
    const name = this.inputRef.current.value
    if(trim(name).length ===0) {
      return;
    }
    if(isUpdate) {
      confirmAction(tableId, name)
    } else {
      const isCreateReferenceTable = selectedFields && selectedFields.length > 0
      const { primaryFieldId } = this.state
      if(isCreateReferenceTable && !primaryFieldId) {
        return;
      }
      
      confirmAction(name, { fields: selectedFields, sourceTableId: tableId, primaryFieldId })
      resetSelectFieldAction()
    }
    toggleModal()
  }

  onEnter = event => {
    const ENTER_KEY_CODE = 13;
    if(event.keyCode === ENTER_KEY_CODE){
      this.onOk()
    }
  }

  renderFields() {
    const { selectedFields } = this.props
    const { primaryFieldId } = this.state
    return selectedFields && selectedFields.length > 0 && (
      <div className="form-control">
        <label className="field-label">主字段</label>
        <Select value={primaryFieldId} onChange={this.onChangeField} placeholder="请选择字段名">
          {
            selectedFields.map(item => {
              return (<Option key={item.id} value={item.id}>{item.name}</Option>)
            })
          }
        </Select>
      </div>
    )
  }

  render() {
    const { visible, title, name } = this.props;
    return (
      <Modal
        wrapClassName="create-table-modal"
        visible={visible} 
        title={title}
        okText="确定"
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onOk}
        >
          <div className="form-control">
            <label className="field-label">表名 </label>
            <input className="field-input" defaultValue={name} onKeyUp={this.onEnter}  ref={this.inputRef}/>
          </div>
          { this.renderFields() }
      </Modal>
    )
  }
}

const mapStateToProps = state => ({ 
  tableId: state.sheets.activeTableId,
  visible: state.sheets.createTableModalVisibility,
  selectedFields: selectedFieldsSelector(state)
})
const mapDispatchToProps = {
  toggleModal: actions.toggleCreateTableModal,
  confirmAction: actions.createTable,
  resetSelectFieldAction: actions.resetSelectField
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateTableModal)