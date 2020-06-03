import { find, findIndex, forEach, cloneDeep } from 'lodash'
import {tableId, columnId, rowId} from '../../../utils/uuid'
import tables from '../../../db'

const getTableIndexById = tableId => findIndex(tables, item => item.tableId === tableId)

const getTableById = tableId => find(tables, item => item.tableId === tableId)

const getItemIndexById = (items, id) => findIndex(items, item => item.id === id)

export const loadTables = () => {
  return Promise.resolve(cloneDeep(tables))
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
  return Promise.resolve(table);
}

export const removeTable = tableId => {
  const tableIndex = getTableIndexById(tableId)
  tables.splice(tableIndex, 1)
  return Promise.resolve(true)
}

export const renameTable = (tableId, name) => {
  const table = getTableById(tableId)
  table.tableName = name;
  return Promise.resolve(table);
}

export const createRow = (tableId, nextRowIndex) => {
  const table = getTableById(tableId)
  const row = {
    id: rowId()
  };
  table.rows.splice(nextRowIndex, 0, row)
  return Promise.resolve(row);
}

export const deleteRow = (tableId, rowId) => {
  const table = getTableById(tableId)
  const rowIndex = findIndex(table.rows, row => row.id === rowId)
  table.rows.splice(rowIndex, 1)
  return Promise.resolve(true)
}

export const addField = (tableId, {name, type, options}, fieldIndex) => {
  const table = getTableById(tableId)
  const field = {
    id: columnId(),
    name,
    type,
    width: 200
  };
  if(options) {
    field.options = options;
  }
  table.fields.splice(fieldIndex, 0, field)
  return Promise.resolve(field);
}

export const removeField = (tableId, fieldId) => {
  const table = getTableById(tableId)
  const fieldIndex = getItemIndexById(table.fields, fieldId)
  const field = table.fields[fieldIndex]
  table.fields.splice(fieldIndex, 1)
  forEach(table.rows, row => {
    delete row[field.id]
  })
  return Promise.resolve(true)
}

export const setFieldPrimary = (tableId, fieldId) => {
  const table = getTableById(tableId)
  // update primary key
  forEach(table.fields, field => {
    if(field.id === fieldId) {
      field.primary = true;
    } else {
      field.primary = false;
    }
  })
  return Promise.resolve(true)
}