import { cloneDeep, findIndex, filter, forEach } from 'lodash'
import { createReducer } from '../../../utils/reducerCreator'
import { mergeFieldsForReferenceTable } from '../services'

const defaultState = {
  tables: [],
  activeTableId: null,
  createTableModalVisibility: false,
  renameTableModalVisibility: false,
  addFieldModalVisibility: false,

  addFieldIndex: -1,

  selectedFields: [],

  editCell: null
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

  createTable(state, {options, table}) {
    const { fields, sourceTableId } = options
    const isCreateReferenceTable = fields && fields.length > 0
    if(isCreateReferenceTable) {
      const sourceTable = mergeFieldsForReferenceTable(table.tableId, options)
      const sourceTableIndex = getTableIndexById(state, sourceTableId)
      state.tables.splice(sourceTableIndex, 1, cloneDeep(sourceTable))
    }
    
    return {...state, tables: [...state.tables, cloneDeep(table)], activeTableId: table.tableId}
  },

  removeTable(state, { tableId }) {
    const firstTable = state.tables[0];
    const tableIndex = getTableIndexById(state, tableId)
    state.tables.splice(tableIndex, 1)

    const selectedFields = filter(state.selectedFields, item => item.tableId !== tableId)

    return {...state, selectedFields, tables: [...state.tables], activeTableId: firstTable && firstTable.tableId }
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
  updateRowCell(state, {tableId, rowId, fieldId, value}){
    const { table, tableIndex } = getTableAndIndexById(state, tableId)

    const rowIndex = findIndex(table.rows, row => row.id === rowId)
    const row = table.rows[rowIndex]

    table.rows.splice(rowIndex, 1, {...row, [fieldId]: value})

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
    const field = table.fields[fieldIndex]
    table.fields.splice(fieldIndex, 1)
    forEach(table.rows, row => {
      delete row[fieldId]
    })
    
    const selectedFields = filter(state.selectedFields, 
      item => item.tableId !== tableId || item.fieldId !== field.id)
    
    return { ...getChangedFieldsState(state, tableIndex), selectedFields}
  },

  selectField(state, {tableId, fieldId}) {
    const item = {tableId, fieldId}
    state.selectedFields.push(item)
    return { ...state, selectedFields: [...state.selectedFields]}
  },

  deselectField(state, {tableId, fieldId}) {
    const index = findIndex(state.selectedFields, 
      item => item.tableId === tableId && item.fieldId === fieldId)
    state.selectedFields.splice(index, 1)
    return { ...state, selectedFields: [...state.selectedFields]}
  },

  resetSelectField(state){
    return { ...state, selectedFields: [] }
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
  },

  setEditCell(state, {tableId, rowId, fieldId} = {}){
    const editCell = tableId ? { tableId, rowId, fieldId } : null
    return {...state, editCell}
  }
}, defaultState)