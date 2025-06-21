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
    // if the number of the collapsed indicators are equal to the number of total indicators, then set the state
    groupBtn.state =
      groupBtn.collIndicators === groupBtn.totalIndicators
        ? 'collapsed'
        : 'expanded';
    if (groupBtn.collIndicators === groupBtn.totalIndicators) {
      // set the state for the clicked btn itself
      const btnEl = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `.group-level-btn[level="${level}"]`
      );
      renderer2.setAttribute(btnEl, 'state', 'collapsed');
      // set also the state for all next level btns, because in case of collapsing they should be collapsed too
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
    // if the number of the expanded indicators are equal to the number of total indicators, then set the state
    groupBtn.state =
      groupBtn.expIndicators === groupBtn.totalIndicators
        ? 'expanded'
        : 'collapsed';
    if (groupBtn.expIndicators === groupBtn.totalIndicators) {
      // set the state for the clicked btn itself
      const btnEl = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `.group-level-btn[level="${level}"]`
      );
      renderer2.setAttribute(btnEl, 'state', 'expanded');
      // set also the state for all next level btns, if every indicator is expanded
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
  // renderer2.setProperty(
  //   div,
  //   'innerHTML',
  //   `<span class="material-symbols-outlined">${icon}</span>`
  // );
  switch (state) {
    case 'expanded':
      if (config.expandIconClass === '') {
        renderer2.setProperty(div, 'innerHTML', `<span>+</span>`);
      } else {
        renderer2.setProperty(
          div,
          'innerHTML',
          `<span class="${config.expandIconClass}"></span>`
        );
      }
      break;
    case 'collapsed':
      if (config.collapseIconClass === '') {
        renderer2.setProperty(div, 'innerHTML', `<span>-</span>`);
      } else {
        renderer2.setProperty(
          div,
          'innerHTML',
          `<span class="${config.collapseIconClass}"></span>`
        );
      }
      break;
  }
}
