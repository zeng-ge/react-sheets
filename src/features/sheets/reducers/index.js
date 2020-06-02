import { find, findIndex, forEach } from 'lodash'
import { createReducer } from '../../../utils/reducerCreator'

const defaultState = {
  tables: [],
  activeTableId: null,
  createTableModalVisibility: false,
  renameTableModalVisibility: false
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
    const tableIndex = findIndex(state.tables, item => item.tableId === tableId)
    state.tables.splice(tableIndex, 1)
    return {...state, tables: [...state.tables], activeTableId: firstTable && firstTable.tableId }
  },
  renameTable(state, {tableId, name}) {
    const table = find(state.tables, item => item.tableId === tableId)
    table.name = name;
    const tableIndex = findIndex(state.tables, item => item.tableId === tableId)
    state.tables.splice(tableIndex, 1, {...table});
    return {...state, tables: [...state.tables] }
  },
  createRow(state, { tableId, currentRow, row }) {
    const table = find(state.tables, item => item.tableId === tableId)
    table.rows.splice(currentRow + 1, 0, row)
    const tableIndex = findIndex(state.tables, item => item.tableId === tableId)
    state.tables.splice(tableIndex, 1, {...table, rows: [...table.rows]});
    return {...state, tables: [...state.tables] }
  },
  deleteRow(state, {tableId, rowId}) {
    const table = find(state.tables, item => item.tableId === tableId)
    const rowIndex = findIndex(table.rows, row => row.id === rowId)
    table.rows.splice(rowIndex, 1)
    
    const tableIndex = findIndex(state.tables, item => item.tableId === tableId)
    state.tables.splice(tableIndex, 1, {...table, rows: [...table.rows]});
    return {...state, tables: [...state.tables] }
  },
  addField(state, {tableId, field}) {
    const table = find(state.tables, item => item.tableId === tableId)
    table.fields.push(field);

    const tableIndex = findIndex(state.tables, item => item.tableId === tableId)
    state.tables.splice(tableIndex, 1, {...table, fields: [...table.fields]});
    return {...state, tables: [...state.tables] }
  },
  removeField(state, {tableId, field}) {
    const table = find(state.tables, item => item.tableId === tableId)
    const fieldIndex = findIndex(table.fields, item => item.id === field.id)
    table.fields.splice(fieldIndex, 1)
    forEach(table.rows, row => {
      delete row[field.id]
    })

    const tableIndex = findIndex(state.tables, item => item.tableId === tableId)
    state.tables.splice(tableIndex, 1, {...table, fields: [...table.fields]});
    return {...state, tables: [...state.tables] }
  },

  activeTable(state, { tableId }) {
    return { ...state, activeTableId: tableId}
  },

  toggleCreateTableModal(state) {
    return { ...state, createTableModalVisibility: !state.createTableModalVisibility }
  },
  toggleRenameTableModal(state) {
    return { ...state, renameTableModalVisibility: !state.renameTableModalVisibility }
  }
}, defaultState)