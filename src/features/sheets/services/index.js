import { find, findIndex, forEach, cloneDeep } from 'lodash'
import {tableId, columnId, rowId} from '../../../utils/uuid'
import tables from '../../../db'

export const loadTables = () => {
  return cloneDeep(tables)
}

export const createTable = name => {
  const table = {
    tableId: tableId(),
    tableName: name,
    fields: [
      { id: 'column-1', name: '名称', type: 'text', primary: true, width: 200 },
      { id: 'column-2', name: '描述', type: 'text', width: 200 },
    ],
    rows: []
  }
  tables.push(table);
  return table;
}

export const removeTable = tableId => {
  const tableIndex = findIndex(tables, item => item.tableId === tableId)
  tables.splice(tableIndex, 1)
}

export const renameTable = (tableId, name) => {
  const table = find(tables, item => item.tableId === tableId)
  table.tableName = name;
  return table;
}

export const createRow = (tableId, nextRowIndex) => {
  const table = find(tables, item => item.tableId === tableId)
  const row = {
    id: rowId()
  };
  table.rows.splice(nextRowIndex, 0, row)
  return row;
}

export const deleteRow = (tableId, rowId) => {
  const table = find(tables, item => item.tableId === tableId)
  const rowIndex = findIndex(table.rows, row => row.id === rowId)
  table.rows.splice(rowIndex, 1)
}

export const addField = (tableId, {name, type, options}) => {
  const table = find(tables, item => item.tableId === tableId)
  const field = {
    id: columnId(),
    name,
    type
  };
  if(options) {
    field.options = options;
  }
  table.fields.push(field);
  return field;
}

export const removeField = (tableId, fieldId) => {
  const table = find(tables, item => item.tableId === tableId)
  const field = find(table.fields, field => field.id === fieldId)
  const fieldIndex = findIndex(table.fields, field => field.id === fieldId)
  table.fields.splice(fieldIndex, 1)
  forEach(table.rows, row => {
    delete row[field.id]
  })
}