import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { ARROWS } from '../consts/constants';

// returns the next visible calcrow
export function getNextVisibleCalcRow(
  actCalcRowDataRowIndex: number,
  config: EnhancedGridConfig,
  e: KeyboardEvent,
  rowAlign: 'bottom' | 'top'
): Element {
  // first get all the visible calc rows
  const calcRows = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll(
    '[kendogridlogicalrow].calcrow:not([collapsed]):not([style*="display: none"])'
  );
  // store the data row index of the visible calc rows
  const calcRowsDataRowIndexes: number[] = [];
  for (let i = 0; i <= calcRows.length - 1; i++) {
    const dataRowIndex = +calcRows[i].getAttribute(
      'data-kendo-grid-item-index'
    )!;
    calcRowsDataRowIndexes.push(dataRowIndex);
  }

  if (e.key === ARROWS.DOWN) {
    // if we are moving downwards, 'actCalcRowDataRowIndex' will be always the actual calc row, from wich we are moving down
    // so, in this case we have to simply find the next visble calc row
    const index = calcRowsDataRowIndexes.findIndex(
      (ind) => ind === actCalcRowDataRowIndex
    );
    let ind = index < calcRowsDataRowIndexes.length - 1 ? index + 1 : index;
    // if the calc rows are bottom aligned, then overwrite 'ind'
    if (rowAlign === 'bottom') ind = index;
    // if bottom and ind/index is -1, then this means, that the next calc row would be a collapsed/hidden one
    // in this case return the next visible calc row
    if (rowAlign === 'bottom' && ind === -1) {
      // get the calcrowname based on the row index
      const calcRowName = config.rowCalculation.calculatedRows.filter((row) =>
        row.rowIndexes?.includes(actCalcRowDataRowIndex)
      )[0].name;
      // get the appr. row
      const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `[kendogridlogicalrow].calcrow:not([collapsed]):not([style*="display: none"]).${calcRowName}`
      )!;
      return row;
    }
    const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `[kendogridlogicalrow].calcrow:not([collapsed]):not([style*="display: none"])[data-kendo-grid-item-index="${calcRowsDataRowIndexes[ind]}"]`
    )!;
    return row;
  } else {
    // if the calc rows are bottom aligned, do it differently (this is only grid with just one group level)
    if (rowAlign === 'bottom') {
      let index = calcRowsDataRowIndexes.findIndex(
        (ind) => ind === actCalcRowDataRowIndex
      );
      if (index === 0) index = 1;
      const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `[kendogridlogicalrow].calcrow:not([collapsed]):not([style*="display: none"])[data-kendo-grid-item-index="${
          calcRowsDataRowIndexes[index - 1]
        }"]`
      )!;
      return row;
    }
    // if we are moving upwards, then 'actCalcRowDataRowIndex' will be the data row index of the previous calc row
    // and this can be visible, but hidden too, so we have to check for it
    const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `[kendogridlogicalrow].calcrow:not([collapsed]):not([style*="display: none"])[data-kendo-grid-item-index="${actCalcRowDataRowIndex}"]`
    );
    // if it is visible, then this will be the next calc row
    if (row) {
      return row;
    } else {
      // otherwise look fo the next visible row
      for (let i = 1; i <= calcRowsDataRowIndexes.length - 1; i++) {
        if (calcRowsDataRowIndexes[i] >= actCalcRowDataRowIndex) {
          const row = (<HTMLElement>(
            config.gridElRef.nativeElement
          )).querySelector(
            `[kendogridlogicalrow].calcrow:not([collapsed]):not([style*="display: none"])[data-kendo-grid-item-index="${
              calcRowsDataRowIndexes[i - 1]
            }"]`
          )!;
          return row;
        }
      }
    }
  }

  return calcRows[0];
}
