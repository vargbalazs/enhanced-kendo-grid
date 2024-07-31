import { SortDescriptor } from '@progress/kendo-data-query';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// adds or removes the sorted class to/from the cells in the sorted column
export function toggleSortedColumnClass(
  sortChangeEvent: SortDescriptor[],
  config: EnhancedGridConfig
) {
  // if there is already one sorted column, then remove the style from it
  if (config.lastSortedColIndex >= 0) {
    // get the existing cssClass property of the column
    const colCssClass = config.columns[config.lastSortedColIndex].cssClass;
    removeSortedClass(colCssClass, config, config.lastSortedColIndex);
  }
  // get the column index of the sorted column
  const field = sortChangeEvent[0].field;
  const colIndex = config.columns.findIndex((col) => col.field === field);
  // get the existing cssClass property of the column
  const colCssClass = config.columns[colIndex].cssClass;
  // add the existing css class or classes to an array
  const cssClasses: string[] = [];
  // add or remove the sorted class to/from the cells
  if (sortChangeEvent[0].dir) {
    // store it as the last sorted column
    config.lastSortedColIndex = colIndex;
    // if there is only one css class
    if (colCssClass && typeof colCssClass === 'string')
      cssClasses.push(colCssClass);
    // if there are multiple css classes
    if (colCssClass && Array.isArray(colCssClass))
      cssClasses.push(...colCssClass);
    // add the sorted class
    cssClasses.push('col-sorted');
    // overwrite the cssClass property with the new array
    config.columns[colIndex].cssClass = cssClasses;
  } else {
    removeSortedClass(colCssClass, config, colIndex);
  }
}

function getColumnCells(
  config: EnhancedGridConfig,
  colIndex: number
): NodeListOf<Element> | undefined {
  // query for the cells in the column
  const gridBody = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    '[kendogridtablebody]'
  );
  const cells = gridBody?.querySelectorAll(
    `[ng-reflect-col-index="${colIndex}"]`
  );
  return cells;
}

function removeSortedClass(
  colCssClass: string | string[] | Set<string> | { [key: string]: any },
  config: EnhancedGridConfig,
  colIndex: number
) {
  if (typeof colCssClass === 'string') config.columns[colIndex].cssClass = '';
  if (Array.isArray(colCssClass))
    config.columns[colIndex].cssClass = (<string[]>colCssClass).filter(
      (cssClass) => cssClass != 'col-sorted'
    );
  // reset lastSortedColIndex
  config.lastSortedColIndex = -1;
}
