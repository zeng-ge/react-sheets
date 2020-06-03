import React from 'react'
import { connect } from 'react-redux'
import { Modal, Select } from 'antd'
import { find, map, uniqueId,trim } from 'lodash'
import actions from '../../../../actions'
import { types, typesMap } from '../../../../../../constants/cells'
import './index.scss'

const Option = Select.Option
export class CreateTableModal extends React.Component{
  constructor(props){
    super(props)
    this.inputRef = React.createRef()
    const defaultType = find(types, item => item.default)
    this.state = { type: defaultType.type, options: [{value: uniqueId('option-id-'), name: ''}] }
  }

  onChangeType = type => {
    this.setState({ type })
  }

  onAddOption = () => {
    const { options } = this.state;
    this.setState({ options: [...options, { value: uniqueId('option-id-'), name: '' }]})
  }

  onRemoveOption = index => () => {
    const { options } = this.state;
    options.splice(index, 1)
    this.setState({ options: [...options]})
  }

  onChangeOptionText = index => event => {
    const { options } = this.state
    const option = options[index]
    options.splice(index, 1, {...option, name: event.target.value})
    this.setState({options: [...options]})
  }

  onCancel = () => {
    const { toggleModal } = this.props
    toggleModal()
  }

  onOk = () => {
    const { addFieldAction, toggleModal, tableId, addFieldIndex } = this.props
    const name = this.inputRef.current.value
    if(trim(name).length === 0) {
      return;
    }
    const { type, options } = this.state
    const field = { name, type}
    if(type === typesMap.RADIO) {
      field.options = map(options, (option, index) => {
        return { value: index + 1, name: option.name, default: index === 0}
      })
    }
    addFieldAction(tableId, field, addFieldIndex)

    toggleModal()
  }

  renderOptions() {
    const { type, options } = this.state
    const shouldShowOptions = typesMap.RADIO === type
    const optionsLength = options.length
    const deletable = optionsLength > 1
    return shouldShowOptions && (
      <div className="options-container">
        {
          map(options, (option, index)=> {
            const no = index + 1;
            const isLastItem = no === optionsLength
            return (
              <div className="form-control" key={option.value}>
                <label className="field-label">选项{no}</label>
                <input className="field-input" onChange={this.onChangeOptionText(index)} />
                { deletable && <span className="button" onClick={this.onRemoveOption(index)}>删除</span>}
                { isLastItem && <span className="button" onClick={this.onAddOption}>添加</span>}
              </div>
            )
          })
        }
      </div>
    );
  }

  renderType() {
    const { type } = this.state
    return (
      <Select value={ type } onChange={this.onChangeType}>
        {
          types.map(item => {
            return (<Option key={item.type} value={item.type}>{item.name}</Option>)
          })
        }
      </Select>
    )
  }

  render() {
    const { visible } = this.props;
    return visible && (
      <Modal
        wrapClassName="add-field-modal"
        visible={visible} 
        title="新建字段"
        okText="确定"
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onOk}
        >
          <div className="form-control">
            <label className="field-label">字段名 </label>
            <input className="field-input" ref={this.inputRef}/>
          </div>
          <div className="form-control">
            <label className="field-label">类型</label>
            { this.renderType() }
          </div>
          { this.renderOptions() }
      </Modal>
    )
  }
}

const mapStateToProps = state => ({ 
  visible: state.sheets.addFieldModalVisibility,
  tableId: state.sheets.activeTableId,
  addFieldIndex: state.sheets.addFieldIndex
})
const mapDispatchToProps = {
  toggleModal: actions.toggleAddFieldModal,
  addFieldAction: actions.addField
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTableModal)