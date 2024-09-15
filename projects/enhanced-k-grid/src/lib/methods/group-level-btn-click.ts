import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

export function groupLevelBtnClick(
  target: any,
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // get the target as a button and get the relevant properties
  const btn = <HTMLButtonElement>target;
  const groupBtnLevel = +btn.getAttribute('level')!;
  const groupBtnState = btn.getAttribute('state')!;
  const newGroupBtnState =
    groupBtnState === 'expanded' ? 'collapsed' : 'expanded';
  btn.setAttribute('state', newGroupBtnState);
  const groupBtn = config.groupLevelButtons.find(
    (btn) => btn.level === groupBtnLevel
  )!;
  groupBtn.state = newGroupBtnState;
  const maxLevel = config.groupLevelButtons.at(-1)?.level!;

  // expanding/collapsing logic
  switch (newGroupBtnState) {
    case 'collapsed':
      if (groupBtnLevel === 3) {
        toggleLevel(config, 3, newGroupBtnState, renderer2);
        console.log('col belép3');
        break;
      }
      if (groupBtnLevel === 2 && getGroupBtnState(3, config) === 'expanded') {
        toggleLevel(config, 3, newGroupBtnState, renderer2);
        setTimeout(() => {
          toggleLevel(config, 2, newGroupBtnState, renderer2);
        }, 700);
        console.log('col belép2');
        break;
      }
      if (groupBtnLevel === 1 && getGroupBtnState(3, config) === 'expanded') {
        toggleLevel(config, 3, newGroupBtnState, renderer2);
        setTimeout(() => {
          toggleLevel(config, 2, newGroupBtnState, renderer2);
          setTimeout(() => {
            toggleLevel(config, 1, newGroupBtnState, renderer2);
          }, 700);
        }, 700);
        console.log('col belép1');
        break;
      }
      if (groupBtnLevel === 1 && getGroupBtnState(2, config) === 'expanded') {
        toggleLevel(config, 2, newGroupBtnState, renderer2);
        setTimeout(() => {
          toggleLevel(config, 1, newGroupBtnState, renderer2);
        }, 700);
        console.log('col belép0');
        break;
      }
      break;
    case 'expanded':
      if (groupBtnLevel === 3) {
        toggleLevel(config, 3, newGroupBtnState, renderer2);
        console.log('exp belép3');
        break;
      }
      if (groupBtnLevel === 2 && getGroupBtnState(3, config) === 'collapsed') {
        toggleLevel(config, 2, newGroupBtnState, renderer2);
        setTimeout(() => {
          toggleLevel(config, 3, newGroupBtnState, renderer2);
        }, 700);
        console.log('exp belép2');
        break;
      }
      if (groupBtnLevel === 1 && getGroupBtnState(3, config) === 'collapsed') {
        toggleLevel(config, 1, newGroupBtnState, renderer2);
        setTimeout(() => {
          toggleLevel(config, 2, newGroupBtnState, renderer2);
          setTimeout(() => {
            toggleLevel(config, 3, newGroupBtnState, renderer2);
          }, 700);
        }, 700);
        console.log('exp belép1');
        break;
      }
      if (groupBtnLevel === 1 && getGroupBtnState(2, config) === 'collapsed') {
        toggleLevel(config, 1, newGroupBtnState, renderer2);
        setTimeout(() => {
          toggleLevel(config, 2, newGroupBtnState, renderer2);
        }, 700);
        console.log('exp belép0');
        break;
      }
      break;
  }
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
    // get the actual state for the indicator/calc row
    const indicatorState = indicator.getAttribute('state');
    // toggle the state only if the indicator/calc row hasn't the new state already
    if (indicatorState !== newGroupBtnState) {
      methods.toggleCalcRowState(indicator, renderer2, config);
    }
  });
}

function getGroupBtnState(
  level: number,
  config: EnhancedGridConfig
): string | undefined {
  return config.groupLevelButtons.find((btn) => btn.level === level)?.state;
}
