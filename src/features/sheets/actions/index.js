import { createActions } from '../../../utils/actionCreator'
import { 
  loadTables, 
  createTable, 
  removeTable, 
  renameTable,
  createRow,
  deleteRow,
  addField,
  removeField
} from '../services'

export default createActions({
  loadTables: () => ({ tables: loadTables() }),

  createTable: name => ({table: createTable(name)}),
  removeTable: tableId => ({tableId, removed: removeTable(tableId)}),
  renameTable: (tableId, name) => ({tableId, name, table: renameTable(tableId, name)}),
  
  createRow: (tableId, currentRow) => ({tableId, currentRow, row: createRow(tableId, currentRow)}),
  deleteRow: (tableId, rowId) => ({deleted: deleteRow(tableId, rowId)}),
  
  addField: (tableId, field) => ({field: addField(tableId, field)}),
  removeField: (tableId, fieldId)=> ({removed: removeField(tableId, fieldId)}),

  activeTable: tableId =>{
    return {tableId};
  },

  toggleCreateTableModal: () => ({}),
  toggleRenameTableModal: () => ({})
})