import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

export function drawGroupLevelBtns(
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // get the group column names
  config.columns
    .filter((col) => col.field.startsWith('grouplevel'))
    .forEach((col) => {
      config.groupLevelButtons.push({
        field: col.field,
        level: +col.field.at(-1)!,
        state: 'expanded',
        expIndicators: getTotalIndicacorsForLevel(+col.field.at(-1)!, config),
        collIndicators: 0,
        totalIndicators: getTotalIndicacorsForLevel(+col.field.at(-1)!, config),
      });
    });
  // define click event listeners
  const listeners: (() => void)[] = [];
  let listener!: () => void;
  // iterate through the group columns
  config.groupLevelButtons.forEach((groupBtn) => {
    // query for the header elements
    const header = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `th[kendogridlogicalcell][aria-colindex="${groupBtn.level}"] span.k-link`
    )!;
    // build the btn with the group lvl in it
    const btn = renderer2.createElement('button') as HTMLButtonElement;
    renderer2.addClass(btn, 'group-level-btn');
    renderer2.setAttribute(btn, 'level', groupBtn.level.toString());
    renderer2.setAttribute(btn, 'state', 'expanded');
    renderer2.setProperty(btn, 'innerHTML', groupBtn.level);
    // add the group lvl btn
    header.appendChild(btn);
    // attach click event listeners
    // add click listener
    listener = renderer2.listen(btn, 'click', () => {
      methods.groupLevelBtnClick(btn, config, renderer2);
    });
    listeners.push(listener);
  });

  // store the click listeners for unlistening on destroy
  config.groupLevelListener = listeners;
}

// get the number of total indicators (+ signs)
function getTotalIndicacorsForLevel(
  level: number,
  config: EnhancedGridConfig
): number {
  const totalInd = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll(`.group-indicator[level="${level}"]`).length;
  return totalInd;
}
