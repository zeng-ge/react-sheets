import { cloneDeep, find, findIndex, forEach, map, reduce } from 'lodash'
import { tableId as tableUUID, columnId, rowId} from '../../../utils/uuid'
import tables from '../../../db'

const getTableIndexById = tableId => findIndex(tables, item => item.tableId === tableId)

const getTableById = tableId => find(tables, item => item.tableId === tableId)

const getItemIndexById = (items, id) => findIndex(items, item => item.id === id)

const cloneFieldsAndRows = ({sourceTableId, primaryFieldId, fields}) => {
  const sourceTable = getTableById(sourceTableId)
  fields = map(fields, field => ({ ...field, primary: field.id === primaryFieldId }))
  const rows = map(sourceTable.rows, row => {
    return reduce(fields, (accumulator, field) => {
      accumulator[field.id] = row[field.id]
      return accumulator
    }, { id: rowId() })
  })
  return { fields, rows }
}

export const mergeFieldsForReferenceTable = (referenceTableId, {sourceTableId, primaryFieldId, fields}) => {
  const sourceTable = getTableById(sourceTableId)
  const { fields: tableFields, rows} = sourceTable
  const newFields = []
  for(let index = 0, length = tableFields.length; index < length; index++) {
    const field = tableFields[index]
    const isFieldNotInReferenceTable = findIndex(fields, item => item.id === field.id) === -1
    const isReferenceKey = field.id === primaryFieldId;
    const shouldFieldKeep = isFieldNotInReferenceTable || isReferenceKey
    if(shouldFieldKeep) {
      const newField = { ...field }
      if(isReferenceKey) {
        field.reference = {
          tableId: referenceTableId,
          fieldId: primaryFieldId
        }
      }
      newFields.push(newField)
    }
  }

  sourceTable.fields = newFields;

  sourceTable.rows = map(rows, row => {
    return reduce(newFields, (accumulator, field) => {
      accumulator[field.id] = row[field.id]
      return accumulator
    }, { id: row.id })
  })
  return sourceTable
}

export const loadTables = () => {
  return Promise.resolve(cloneDeep(tables))
}

export const createTable = (name, options) => {
  const tableId = tableUUID()
  let fields = [
    { id: columnId(), name: '名称', type: 'text', primary: true, width: 200 },
    { id: columnId(), name: '描述', type: 'text', width: 200 },
  ]
  let rows = []

  const isCreateReferenceTable = options.fields && options.fields.length > 0;
  if(isCreateReferenceTable) {
    const clonedFieldsRows = cloneFieldsAndRows(options)
    fields = clonedFieldsRows.fields
    rows = clonedFieldsRows.rows

    mergeFieldsForReferenceTable(tableId, options)
  }
  
  const table = {
    tableId,
    tableName: name,
    fields,
    rows
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