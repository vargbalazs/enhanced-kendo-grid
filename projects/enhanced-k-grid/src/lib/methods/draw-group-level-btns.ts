import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

export function drawGroupLevelBtns(
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // get the group column names
  const groupColNames: string[] = [];
  config.columns
    .filter((col) => col.field.startsWith('grouplevel'))
    .forEach((col) => {
      groupColNames.push(col.field);
    });
  // define click event listeners
  const listeners: (() => void)[] = [];
  let listener!: () => void;
  // iterate through the group columns
  groupColNames.forEach((colName) => {
    // query for the header elements
    const header = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `th[kendogridlogicalcell][ng-reflect-header-label-text=${colName}] span.k-link`
    )!;
    // build the btn with the group lvl in it
    const btn = renderer2.createElement('button') as HTMLButtonElement;
    renderer2.addClass(btn, 'group-level-btn');
    renderer2.setAttribute(btn, 'level', colName.at(-1)!);
    renderer2.setProperty(btn, 'innerHTML', colName.at(-1));
    // add the group lvl btn
    header.appendChild(btn);
    // attach click event listeners
    // add click listener
    listener = renderer2.listen(btn, 'click', () => {
      methods.groupLevelBtnClick(btn, config);
    });
    listeners.push(listener);
  });

  // store the click listeners for unlistening on destroy
  config.groupLevelListener = listeners;
}
