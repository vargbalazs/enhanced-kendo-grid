import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

export function groupLevelBtnClick(
  target: any,
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // get the target as a button and get the level and state
  const btn = <HTMLButtonElement>target;
  const groupBtnLevel = +btn.getAttribute('level')!;
  const groupBtnState = btn.getAttribute('state')!;
  const newGroupBtnState =
    groupBtnState === 'expanded' ? 'collapsed' : 'expanded';
  btn.setAttribute('state', newGroupBtnState);
  // get the group indicators for this level and perform a click action
  // const indicators = (<HTMLElement>(
  //   config.gridElRef.nativeElement
  // )).querySelectorAll(`.group-indicator[level="${groupBtnLevel}"]`);
  // indicators.forEach((indicator) => {
  //   // (<HTMLElement>indicator).click();
  //   // get the actual state for the indicator/calc row
  //   const indicatorState = indicator.getAttribute('state');
  //   // toggle the state only if the indicator/calc row hasn't the new state already
  //   if (indicatorState !== newGroupBtnState) {
  //     methods.toggleCalcRowState(indicator, renderer2, config);
  //   }
  // });

  if (groupBtnLevel === 1 && newGroupBtnState === 'collapsed') {
    toggleLevel(config, 3, newGroupBtnState, renderer2);
    setTimeout(() => {
      toggleLevel(config, 2, newGroupBtnState, renderer2);
      setTimeout(() => {
        toggleLevel(config, 1, newGroupBtnState, renderer2);
      }, 700);
    }, 700);
  }

  if (groupBtnLevel === 2 && newGroupBtnState === 'collapsed') {
    toggleLevel(config, 3, newGroupBtnState, renderer2);
    setTimeout(() => {
      toggleLevel(config, 2, newGroupBtnState, renderer2);
    }, 700);
  }

  // if (groupBtnLevel === 1 && newGroupBtnState === 'expanded') {
  //   toggleLevel(config, 1, newGroupBtnState, renderer2);
  //   setTimeout(() => {
  //     toggleLevel(config, 2, newGroupBtnState, renderer2);
  //     setTimeout(() => {
  //       toggleLevel(config, 3, newGroupBtnState, renderer2);
  //     }, 700);
  //   }, 700);
  // }
}

function toggleLevel(
  config: EnhancedGridConfig,
  level: number,
  newGroupBtnState: string,
  renderer2: Renderer2
) {
  // get the group indicators for this level and perform a click action
  const indicators = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll(`.group-indicator[level="${level.toString()}"]`);
  indicators.forEach((indicator) => {
    // (<HTMLElement>indicator).click();
    // get the actual state for the indicator/calc row
    const indicatorState = indicator.getAttribute('state');
    // toggle the state only if the indicator/calc row hasn't the new state already
    if (indicatorState !== newGroupBtnState) {
      methods.toggleCalcRowState(indicator, renderer2, config);
    }
  });
}
