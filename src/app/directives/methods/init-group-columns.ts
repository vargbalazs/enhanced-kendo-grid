import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';

// initializes the columns used for grouping
export function initGroupColumns(
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // get the group column indexes
  const groupColIndexes: number[] = [];
  config.columns
    .filter((col) => col.field.startsWith('grouplevel'))
    .forEach((col) => {
      groupColIndexes.push(
        config.columns.findIndex((col2) => col2.field === col.field)
      );
    });

  // query for the calcrow cells in the group columns
  // get the calcrow indexes
  const calcRowIndexes: number[] = [];
  config.rowCalculation.calculatedRows.forEach((calcRow) => {
    calcRowIndexes.push(
      config.gridData.findIndex((row) => row.calcRowName === calcRow.name)
    );
  });
  // get the cells and calc row states
  const groupColCells: Element[] = [];
  const calcRowStates: string[] = [];
  for (let i = 0; i <= groupColIndexes.length - 1; i++) {
    for (let j = 0; j <= calcRowIndexes.length - 1; j++) {
      let groupCell = (<HTMLElement>(
        config.gridElRef.nativeElement
      )).querySelector(
        `[ng-reflect-data-row-index="${calcRowIndexes[j]}"][ng-reflect-col-index="${groupColIndexes[i]}"]`
      );
      calcRowStates.push(getStateForCalcRow(config, calcRowIndexes[j]));
      groupColCells.push(groupCell!);
    }
  }

  // add expand/collapse buttons
  const listeners: (() => void)[] = [];
  let listener!: () => void;

  let calcRowIndex = 0;
  groupColCells.forEach((groupCell) => {
    const div = renderer2.createElement('div') as HTMLDivElement;
    renderer2.addClass(div, 'group-indicator');
    renderer2.setProperty(
      div,
      'innerHTML',
      `<span class="material-symbols-outlined">remove</span>`
    );
    renderer2.setAttribute(div, 'state', calcRowStates[calcRowIndex]);
    // add click listener
    listener = renderer2.listen(div, 'click', () => alert('group clicked'));
    listeners.push(listener);
    groupCell.appendChild(div);
    calcRowIndex++;
  });
  config.ExpandCollapseListener = listeners;
}

function getStateForCalcRow(
  config: EnhancedGridConfig,
  calcRowIndex: number
): string {
  const calcRowName = config.gridData[calcRowIndex].calcRowName;
  return config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.name === calcRowName
  )?.state!;
}
