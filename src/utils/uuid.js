import { uniqueId } from 'lodash'

export const columnId = () => {
  return uniqueId('column-id-')
}

export const tableId = () => {
  return uniqueId('table-id-')
}

export const rowId = () => {
  return uniqueId('row-id-')
}