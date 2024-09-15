import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// toggle state (on click)
export function toggleCalcRowState(
  div: Element,
  renderer2: Renderer2,
  config: EnhancedGridConfig
) {
  const state = div.getAttribute('state');
  const rowName = div.getAttribute('calcRowName')!;
  const level = +div.getAttribute('level')!;
  const groupBtn = config.groupLevelButtons.find((btn) => btn.level === level)!;
  let icon = '';
  if (state === 'expanded') {
    renderer2.setAttribute(div, 'state', 'collapsed');
    icon = 'add';
    methods.setStateForCalcRow(config, rowName, 'collapsed', renderer2);
    methods.animateTableRows(config, rowName, 'collapsed', renderer2);
    // update the state for the corresponding group lvl btn
    groupBtn.collIndicators += 1;
    groupBtn.expIndicators -= 1;
    // if there is at least one collapsed indicator, then set the state of the appr. group lvl btn accordingly
    groupBtn.state = groupBtn.collIndicators > 0 ? 'collapsed' : 'expanded';
    if (groupBtn.collIndicators > 0) {
      // set the state for the clicked btn itself
      const btnEl = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `.group-level-btn[level="${level}"]`
      );
      renderer2.setAttribute(btnEl, 'state', 'collapsed');
      // set also the state for all next level btns
      const maxLevel = config.groupLevelButtons.at(-1)?.level!;
      for (let i = level + 1; i <= maxLevel; i++) {
        const groupBtnNext = config.groupLevelButtons.find(
          (btn) => btn.level === i
        )!;
        groupBtnNext.state = 'collapsed';
        const btnElNext = (<HTMLElement>(
          config.gridElRef.nativeElement
        )).querySelector(`.group-level-btn[level="${i}"]`);
        renderer2.setAttribute(btnElNext, 'state', 'collapsed');
      }
    }
  } else {
    renderer2.setAttribute(div, 'state', 'expanded');
    icon = 'remove';
    methods.setStateForCalcRow(config, rowName, 'expanded', renderer2);
    methods.animateTableRows(config, rowName, 'expanded', renderer2);
    // update the state for the corresponding group lvl btn
    groupBtn.collIndicators -= 1;
    groupBtn.expIndicators += 1;
    // if there is at least one collapsed indicator, then set the state of the appr. group lvl btn accordingly
    groupBtn.state = groupBtn.collIndicators > 0 ? 'collapsed' : 'expanded';
    if (groupBtn.expIndicators === groupBtn.totalIndicators) {
      // set the state for the clicked btn itself
      const btnEl = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `.group-level-btn[level="${level}"]`
      );
      renderer2.setAttribute(btnEl, 'state', 'expanded');
      // set also the state for all next level btns, but only if all of the indicators of the next level are expanded
      const maxLevel = config.groupLevelButtons.at(-1)?.level!;
      for (let i = level + 1; i <= maxLevel; i++) {
        const groupBtnNext = config.groupLevelButtons.find(
          (btn) => btn.level === i
        )!;
        const indicators = (<HTMLElement>(
          config.gridElRef.nativeElement
        )).querySelectorAll(`.group-indicator[level="${i.toString()}"]`);
        if (
          Array.from(indicators).every(
            (indicator) => indicator.getAttribute('state') === 'expanded'
          )
        ) {
          groupBtnNext.state = 'expanded';
          const btnElNext = (<HTMLElement>(
            config.gridElRef.nativeElement
          )).querySelector(`.group-level-btn[level="${i}"]`);
          renderer2.setAttribute(btnElNext, 'state', 'expanded');
        }
      }
    }
  }
  renderer2.setProperty(
    div,
    'innerHTML',
    `<span class="material-symbols-outlined">${icon}</span>`
  );
}
