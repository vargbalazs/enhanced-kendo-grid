import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';
import { CalcRowWithState } from '../interfaces/calculated-row-with-state.interface';

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

  // get the calcrow indexes
  const calcRowIndexes: number[] = [];
  config.rowCalculation.calculatedRows.forEach((calcRow) => {
    calcRowIndexes.push(
      config.gridData.findIndex((row) => row.calcRowName === calcRow.name)
    );
  });

  // get the cells in the grouped columns and in the calc rows
  // get also the initial calc row states
  const groupColCells: Element[] = [];
  const calcRowStates: CalcRowWithState[] = [];
  for (let i = 0; i <= groupColIndexes.length - 1; i++) {
    for (let j = 0; j <= calcRowIndexes.length - 1; j++) {
      let groupCell = (<HTMLElement>(
        config.gridElRef.nativeElement
      )).querySelector(
        `[ng-reflect-data-row-index="${calcRowIndexes[j]}"][ng-reflect-col-index="${groupColIndexes[i]}"]`
      );
      calcRowStates.push(methods.getStateForCalcRow(config, calcRowIndexes[j]));
      groupColCells.push(groupCell!);
    }
  }

  // add expand/collapse buttons
  // define click event listeners
  const listeners: (() => void)[] = [];
  let listener!: () => void;

  // we have as many group cells as calc rows, that's why we can use a simple index for accessing the calcRowStates
  let calcRowIndex = 0;
  groupColCells.forEach((groupCell) => {
    // build the div with the group indicator in it
    const div = renderer2.createElement('div') as HTMLDivElement;
    renderer2.addClass(div, 'group-indicator');
    const icon =
      calcRowStates[calcRowIndex].state === 'expanded' ? 'remove' : 'add';
    renderer2.setProperty(
      div,
      'innerHTML',
      `<span class="material-symbols-outlined">${icon}</span>`
    );
    // add calc row state and calc row name as attributes
    renderer2.setAttribute(div, 'state', calcRowStates[calcRowIndex].state);
    renderer2.setAttribute(
      div,
      'calcRowName',
      calcRowStates[calcRowIndex].calcRowName
    );
    // add click listener
    listener = renderer2.listen(div, 'click', () =>
      methods.toggleCalcRowState(div, renderer2, config)
    );
    listeners.push(listener);
    // since the 'initGroupColumns' method gets called on every click on a calc row, we have to remove
    // the group indicator, if there was one already
    const groupIndicator = groupCell.querySelector('.group-indicator');
    if (groupIndicator) groupCell.removeChild(groupIndicator);
    // add the group indicator
    groupCell.appendChild(div);
    // set the inital class for the corresponding rows, but only once
    if (!config.groupColumnsInitialized)
      methods.setStateForCalcRow(
        config,
        calcRowStates[calcRowIndex].calcRowName,
        calcRowStates[calcRowIndex].state,
        renderer2
      );
    calcRowIndex++;
  });
  // store the click listeners for unlistening on destroy
  config.expandCollapseListener = listeners;
  // initialize done
  config.groupColumnsInitialized = true;

  config.columnWidths = [];
  config.columns.forEach((col) => {
    const cell = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `[ng-reflect-col-index='${col.leafIndex}']`
    );
    config.columnWidths.push(getComputedStyle(cell!).width);
  });
}
