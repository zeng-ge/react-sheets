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

  createTable: name => ({table: createTable(name)}),
  removeTable: tableId => ({tableId, removed: removeTable(tableId)}),
  renameTable: (tableId, name) => ({tableId, name, table: renameTable(tableId, name)}),
  
  createRow: (tableId, nextRowIndex) => ({tableId, nextRowIndex, row: createRow(tableId, nextRowIndex)}),
  deleteRow: (tableId, rowId) => ({tableId, rowId, deleted: deleteRow(tableId, rowId)}),
  
  addField: (tableId, fieldOptions, fieldIndex) => ({tableId, fieldOptions, fieldIndex, field: addField(tableId, fieldOptions, fieldIndex)}),
  removeField: (tableId, fieldId) => ({tableId, fieldId, removed: removeField(tableId, fieldId)}),
  setFieldPrimary: (tableId, fieldId) => ({ tableId, fieldId, updated: setFieldPrimary(tableId, fieldId)}),

  activeTable: tableId =>{
    return {tableId};
  },

  toggleCreateTableModal: () => ({}),
  toggleRenameTableModal: () => ({}),
  toggleAddFieldModal: fieldIndex => ({ fieldIndex })
})