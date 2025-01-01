import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// set the state for a calculated row
export function setStateForCalcRow(
  config: EnhancedGridConfig,
  calcRowName: string,
  state: 'expanded' | 'collapsed',
  renderer2: Renderer2
) {
  config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.name === calcRowName
  )!.state = state;
  // hide or show the rows corresponding to a calculated row
  switch (state) {
    case 'expanded':
      // query for the corresponding rows
      const calcRowExp = config.rowCalculation.calculatedRows.find(
        (calcRow) => calcRow.name === calcRowName
      );
      setTimeout(() => {
        calcRowExp?.rowIndexes?.forEach((rowIndex) => {
          const dataRow = (<HTMLElement>(
            config.gridElRef.nativeElement
          )).querySelector(
            `[kendogridlogicalrow][data-kendo-grid-item-index="${rowIndex}"]`
          );
          // renderer2.removeClass(dataRow, 'collapsed-row');
          // renderer2.addClass(dataRow, 'expanded-row');
          // set also the calcrow name on each row
          // renderer2.setAttribute(dataRow, 'calcrowname', calcRowName);
        });
      });
      break;
    case 'collapsed':
      // query for the corresponding rows
      const calcRowColl = config.rowCalculation.calculatedRows.find(
        (calcRow) => calcRow.name === calcRowName
      );
      setTimeout(() => {
        calcRowColl?.rowIndexes?.forEach((rowIndex) => {
          const dataRow = (<HTMLElement>(
            config.gridElRef.nativeElement
          )).querySelector(
            `[kendogridlogicalrow][data-kendo-grid-item-index="${rowIndex}"]`
          );
          // renderer2.removeClass(dataRow, 'expanded-row');
          // renderer2.addClass(dataRow, 'collapsed-row');
          // set also the calcrow name on each row
          // renderer2.setAttribute(dataRow, 'calcrowname', calcRowName);
        });
      });
      break;
  }
}
