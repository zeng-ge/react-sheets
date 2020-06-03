import { findIndex, forEach } from 'lodash'
import { createReducer } from '../../../utils/reducerCreator'

const defaultState = {
  tables: [],
  activeTableId: null,
  createTableModalVisibility: false,
  renameTableModalVisibility: false,
  addFieldModalVisibility: false,

  addFieldIndex: -1
}

const getTableIndexById = (state, tableId) => {
  return findIndex(state.tables, item => item.tableId === tableId)
}

const getTableAndIndexById = (state, tableId) => {
  const tableIndex = getTableIndexById(state, tableId)
  const table = state.tables[tableIndex]
  return { table, tableIndex }
}

const getChangedRowsState = (state, tableIndex) => {
  const table = state.tables[tableIndex]
  state.tables.splice(tableIndex, 1, {...table, rows: [...table.rows]});
  return {...state, tables: [...state.tables] }
}

const getChangedFieldsState = (state, tableIndex) => {
  const table = state.tables[tableIndex]
  state.tables.splice(tableIndex, 1, {...table, fields: [...table.fields]});
  return {...state, tables: [...state.tables] }
}

export default createReducer({
  loadTables(state, {tables}){
    const firstTable = tables[0];
    return {...state, tables, activeTableId: firstTable && firstTable.tableId }
  },

  createTable(state, {table}) {
    return {...state, tables: [...state.tables, table], activeTableId: table.tableId}
  },

  removeTable(state, { tableId }) {
    const firstTable = state.tables[0];
    const tableIndex = getTableIndexById(state, tableId)
    state.tables.splice(tableIndex, 1)
    return {...state, tables: [...state.tables], activeTableId: firstTable && firstTable.tableId }
  },
  renameTable(state, {tableId, name}) {
    const { table, tableIndex } = getTableAndIndexById(state, tableId)
    state.tables.splice(tableIndex, 1, {...table, tableName: name});
    return {...state, tables: [...state.tables] }
  },
  createRow(state, { tableId, nextRowIndex, row }) {
    const { table, tableIndex } = getTableAndIndexById(state, tableId)

    table.rows.splice(nextRowIndex, 0, row)

    return getChangedRowsState(state, tableIndex)
  },
  deleteRow(state, {tableId, rowId}) {
    const { table, tableIndex } = getTableAndIndexById(state, tableId)

    const rowIndex = findIndex(table.rows, row => row.id === rowId)
    table.rows.splice(rowIndex, 1)
    
    return getChangedRowsState(state, tableIndex)
  },

  addField(state, {tableId, field, fieldIndex}) {
    const { table, tableIndex } = getTableAndIndexById(state, tableId)

    table.fields.splice(fieldIndex, 0, field)

    return getChangedFieldsState(state, tableIndex)
  },
  removeField(state, {tableId, fieldId}) {
    const { table, tableIndex } = getTableAndIndexById(state, tableId)

    const fieldIndex = findIndex(table.fields, item => item.id === fieldId)
    table.fields.splice(fieldIndex, 1)
    forEach(table.rows, row => {
      delete row[fieldId]
    })

    return getChangedFieldsState(state, tableIndex)
  },

  setFieldPrimary(state, {tableId, fieldId}) {
    const { table, tableIndex } = getTableAndIndexById(state, tableId)
    
    for(let index = 0, length = table.fields.length; index < length; index++) {
      const field = table.fields[index]
      if(field.id === fieldId) {
        table.fields[index] = { ...field, primary: true }
      } else {
        if(field.primary) {
          table.fields[index] = { ...field, primary: false }
        }
      }
    }

    return getChangedFieldsState(state, tableIndex)
  },

  activeTable(state, { tableId }) {
    return { ...state, activeTableId: tableId}
  },

  toggleCreateTableModal(state) {
    return { ...state, createTableModalVisibility: !state.createTableModalVisibility }
  },
  toggleRenameTableModal(state) {
    return { ...state, renameTableModalVisibility: !state.renameTableModalVisibility }
  },
  toggleAddFieldModal(state, { fieldIndex }) {
    const visible = !state.addFieldModalVisibility;
    return { ...state, addFieldModalVisibility: visible, addFieldIndex: visible ? fieldIndex : -1 }
  }
}, defaultState)