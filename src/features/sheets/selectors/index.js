import { createSelector } from 'reselect'
import { find, map, reduce } from 'lodash'

export const currentTableSelector = createSelector(
  state => state.sheets.activeTableId,
  state => state.sheets.tables,
  (id, tables) => find(tables, table => table.tableId ===id)
)

export const selectedFieldsSelector = createSelector(
  state => state.sheets.tables,
  state => state.sheets.selectedFields,
  (tables, selectedFields) => {
    const tableMap = reduce(tables, (accumulator, table) => {
      accumulator[table.tableId] = table
      return accumulator
    }, {})
    
    return map(selectedFields, ({tableId, fieldId}) => {
      const { fields } = tableMap[tableId]
      return find(fields, field => field.id === fieldId )
    })
  }
)