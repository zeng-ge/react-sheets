import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import { trim } from 'lodash'
import actions from '../../../../actions'
import './index.scss'

export class CreateTableModal extends React.Component{
  constructor(props){
    super(props)
    this.inputRef = null
  }

  onCancel = () => {
    const { toggleModal } = this.props
    toggleModal()
  }

  onOk = () => {
    const { confirmAction, toggleModal, tableId } = this.props
    const name = this.inputRef.value
    if(trim(name).length ===0) {
      return;
    }
    if(tableId) {
      confirmAction(tableId, name)
    } else {
      confirmAction(name)
    }
    toggleModal()
  }

  onEnter = event => {
    const ENTER_KEY_CODE = 13;
    if(event.keyCode === ENTER_KEY_CODE){
      this.onOk()
    }
  }

  render() {
    const { visible, title, name } = this.props;
    return visible && (
      <Modal
        wrapClassName="create-table-modal"
        visible={visible} 
        title={title}
        okText="确定"
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onOk}
        >
          <label>
            表名 <input defaultValue={name} ref={input => {
                  this.inputRef = input
                  input && input.focus()
                }} 
                onKeyUp={this.onEnter}/>
          </label>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({ 
  visible: state.sheets.createTableModalVisibility,
  
})
const mapDispatchToProps = {
  toggleModal: actions.toggleCreateTableModal,
  confirmAction: actions.createTable
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTableModal)