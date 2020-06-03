import { createActions } from '../../../utils/actionCreator'
import { 
  loadTables, 
  createTable, 
  removeTable, 
  renameTable,
  createRow,
  deleteRow,
  addField,
  removeField,
  setFieldPrimary
} from '../services'

export default createActions({
  loadTables: () => ({ tables: loadTables() }),

  createTable: (name, options) => ({options, table: createTable(name, options)}),
  removeTable: tableId => ({tableId, removed: removeTable(tableId)}),
  renameTable: (tableId, name) => ({tableId, name, table: renameTable(tableId, name)}),
  
  createRow: (tableId, nextRowIndex) => ({tableId, nextRowIndex, row: createRow(tableId, nextRowIndex)}),
  deleteRow: (tableId, rowId) => ({tableId, rowId, deleted: deleteRow(tableId, rowId)}),
  updateRowCell: (tableId, rowId, fieldId, value) => ({tableId, rowId, fieldId, value}),
  
  addField: (tableId, fieldOptions, fieldIndex) => ({tableId, fieldOptions, fieldIndex, field: addField(tableId, fieldOptions, fieldIndex)}),
  removeField: (tableId, fieldId) => ({tableId, fieldId, removed: removeField(tableId, fieldId)}),
  setFieldPrimary: (tableId, fieldId) => ({ tableId, fieldId, updated: setFieldPrimary(tableId, fieldId)}),
  selectField: (tableId, fieldId) => ({tableId, fieldId}),
  deselectField: (tableId, fieldId) => ({tableId, fieldId}),
  resetSelectField: () => ({}),

  activeTable: tableId =>{
    return {tableId};
  },

  toggleCreateTableModal: () => ({}),
  toggleRenameTableModal: () => ({}),
  toggleAddFieldModal: fieldIndex => ({ fieldIndex }),

  setEditCell: (tableId, rowId, fieldId) => ({tableId, rowId, fieldId})
})