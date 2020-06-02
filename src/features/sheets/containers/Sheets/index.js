import React from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash'
import classnames from 'classnames'
import { Menu, Dropdown } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons'
import Sheet from './Sheet'
import CreateTableModal from './modals/CreateTable'
import RenameTableModal from './modals/RenameTable'
import actions from '../../actions'
import { currentTableSelector } from '../../selectors'
import './index.scss'

export class Sheets extends React.Component{

  componentDidMount(){
    const { loadTables } = this.props
    loadTables()
  }

  onSelectTab = tableId => () => {
    const { activeTable } = this.props;
    activeTable(tableId);
  }

  onOpenCreateTableModal = () => {
    const { toggleCreateTableModal } = this.props
    toggleCreateTableModal()
  }

  onOpenRenameTableModal = tableId => event => {
    const { toggleRenameTableModal, activeTable } = this.props
    activeTable(tableId);
    toggleRenameTableModal()
    event.domEvent.stopPropagation()
  }

  onRemoveTable = tableId => event => {
    const { removeTable } = this.props
    removeTable(tableId)
    event.domEvent.stopPropagation()
  }

  onRenameTable = tableId => () => {
    const { removeTable } = this.props;
    removeTable(tableId)
  }

  getTableMenu(tableId) {
    return (
      <Menu>
        <Menu.Item onClick={this.onRemoveTable(tableId)}>
          <span>删除表</span>
        </Menu.Item>
        <Menu.Item onClick={this.onOpenRenameTableModal(tableId)}>
          <span>重命名</span>
        </Menu.Item>
      </Menu>
    )
  }

  renderTableMenu(tableId){
    return (
      <Dropdown 
        overlay={this.getTableMenu(tableId)} 
        placement="bottomCenter" trigger="click">
        <CaretDownOutlined onClick={event => event.stopPropagation()}/>
      </Dropdown>
    )
  }

  renderTabs() {
    const { tables, activedTable = {} } = this.props
    return (
      <ul className="tab-header">
        {
          map(tables, table => {
            return (
              <li 
                className={classnames("tab-item", { active: table.tableId === activedTable.tableId})} 
                onClick={this.onSelectTab(table.tableId)}
                key={table.tableId}>
                  {table.tableName}
                  {
                    this.renderTableMenu(table.tableId)
                  }
              </li>)
          })
        }
        <li className="tab-item" key="create-table" onClick={this.onOpenCreateTableModal}>+ 建表</li>
      </ul>
    )
  }
  renderTable() {
    const { activedTable } = this.props
    return (
      <Sheet table={activedTable}/>
    )
  }
  render() {
    const { activedTable = {} } = this.props;
    return (
      <div className="sheets">
        { this.renderTabs() }
        { this.renderTable() }
        <CreateTableModal title="建表"/>
        <RenameTableModal title="修改表名" name={activedTable.tableName} />
      </div>
    )
  }
}

const mapStateToProps = state => ({ 
  tables: state.sheets.tables,
  activedTable: currentTableSelector(state)
})
const mapDispatchToProps = actions

export default connect(mapStateToProps, mapDispatchToProps)(Sheets)