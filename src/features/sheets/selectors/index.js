import { createSelector } from 'reselect'
import { find } from 'lodash'

export const currentTableSelector = createSelector(
  state => state.sheets.activeTableId,
  state => state.sheets.tables,
  (id, tables) => find(tables, table => table.tableId ===id)
)