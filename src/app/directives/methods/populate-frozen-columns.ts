import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// populates the frozen columns and searches the column indexes
export function populateFrozenColumns(
  config: EnhancedGridConfig,
  frozenColumns: string[]
) {
  for (let i = 0; i <= frozenColumns.length - 1; i++) {
    if (
      config.columns.findIndex((column) => column.field === frozenColumns[i]) !=
      -1
    )
      config.frozenColumns.push({
        field: frozenColumns[i],
        columnIndex: config.columns.findIndex(
          (column) => column.field === frozenColumns[i]
        ),
      });
  }
}
