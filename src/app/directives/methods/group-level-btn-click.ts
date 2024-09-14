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

  // expanding/collapsing logic
  switch (groupBtnLevel) {
    case 3:
      if (
        getGroupBtnState(2, config) === 'expanded' &&
        getGroupBtnState(1, config) === 'expanded'
      ) {
        // if lvl 2 has at least one collapsed group, then first expand it
        // this happens, if we collapse a group by clicking on an indicator
        const level2Indicator = (<HTMLElement>(
          config.gridElRef.nativeElement
        )).querySelectorAll(
          `.group-indicator[level="${2}"][state="collapsed"]`
        ).length;
        if (level2Indicator > 0) {
          methods.drawOverlay(config, renderer2, 'on');
          methods.toggleLevel(config, 2, 'expanded', renderer2);
          setTimeout(() => {
            methods.toggleLevel(config, 3, newGroupBtnState, renderer2);
            // console.log('case 1');
            // checkStatesViaConsol(config);
            methods.drawOverlay(config, renderer2, 'off');
          }, 700);
        } else {
          methods.toggleLevel(config, 3, newGroupBtnState, renderer2);
          // console.log('case 1');
          // checkStatesViaConsol(config);
        }
        break;
      }
      if (
        getGroupBtnState(2, config) === 'collapsed' &&
        getGroupBtnState(1, config) === 'expanded'
      ) {
        methods.drawOverlay(config, renderer2, 'on');
        methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
        setTimeout(() => {
          methods.toggleLevel(config, 3, newGroupBtnState, renderer2);
          methods.drawOverlay(config, renderer2, 'off');
          // checkStatesViaConsol(config);
        }, 700);
        // console.log('case 2');
        break;
      }
      if (getGroupBtnState(1, config) === 'collapsed') {
        methods.drawOverlay(config, renderer2, 'on');
        methods.toggleLevel(config, 1, newGroupBtnState, renderer2);
        setTimeout(() => {
          methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
          setTimeout(() => {
            methods.toggleLevel(config, 3, newGroupBtnState, renderer2);
            methods.drawOverlay(config, renderer2, 'off');
            // checkStatesViaConsol(config);
          }, 700);
        }, 700);
        // console.log('case 3');
        break;
      }
      break;
    case 2:
      if (
        getGroupBtnState(2, config) === 'collapsed' &&
        getGroupBtnState(3, config) === 'expanded'
      ) {
        methods.drawOverlay(config, renderer2, 'on');
        methods.toggleLevel(config, 3, newGroupBtnState, renderer2);
        setTimeout(() => {
          methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
          methods.drawOverlay(config, renderer2, 'off');
          // checkStatesViaConsol(config);
        }, 700);
        // console.log('case 9');
        break;
      }
      if (
        getGroupBtnState(2, config) === 'collapsed' &&
        getGroupBtnState(3, config) === 'collapsed'
      ) {
        methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
        // console.log('case 10');
        // checkStatesViaConsol(config);
        break;
      }
      if (getGroupBtnState(1, config) === 'collapsed') {
        methods.drawOverlay(config, renderer2, 'on');
        methods.toggleLevel(config, 1, newGroupBtnState, renderer2);
        setTimeout(() => {
          methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
          methods.drawOverlay(config, renderer2, 'off');
          // checkStatesViaConsol(config);
        }, 700);
        // console.log('case 4');
        break;
      }
      if (getGroupBtnState(1, config) === 'expanded') {
        methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
        // console.log('case 5 ');
        // checkStatesViaConsol(config);
        break;
      }
      break;
    case 1:
      if (
        getGroupBtnState(1, config) === 'collapsed' &&
        getGroupBtnState(3, config) === 'expanded'
      ) {
        methods.drawOverlay(config, renderer2, 'on');
        methods.toggleLevel(config, 3, newGroupBtnState, renderer2);
        setTimeout(() => {
          methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
          setTimeout(() => {
            methods.toggleLevel(config, 1, newGroupBtnState, renderer2);
            // checkStatesViaConsol(config);
            methods.drawOverlay(config, renderer2, 'off');
          }, 700);
        }, 700);
        // console.log('case 6');
        break;
      }
      if (
        getGroupBtnState(1, config) === 'collapsed' &&
        getGroupBtnState(2, config) === 'expanded'
      ) {
        methods.drawOverlay(config, renderer2, 'on');
        methods.toggleLevel(config, 2, newGroupBtnState, renderer2);
        setTimeout(() => {
          methods.toggleLevel(config, 1, newGroupBtnState, renderer2);
          methods.drawOverlay(config, renderer2, 'off');
          // checkStatesViaConsol(config);
        }, 700);
        // console.log('case 7');
        break;
      }
      methods.toggleLevel(config, 1, newGroupBtnState, renderer2);
      // console.log('case 8');
      // checkStatesViaConsol(config);
      break;
  }
}

function getGroupBtnState(
  level: number,
  config: EnhancedGridConfig
): string | undefined {
  return config.groupLevelButtons.find((btn) => btn.level === level)?.state;
}

function checkStatesViaConsol(config: EnhancedGridConfig) {
  console.table(config.groupLevelButtons, [
    'level',
    'state',
    'expIndicators',
    'collIndicators',
  ]);
  const groupLvlBtns = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('.group-level-btn');
  const groupLvlBtnData: any[] = [];
  groupLvlBtns.forEach((btn) => {
    groupLvlBtnData.push({
      level: btn.getAttribute('level'),
      state: btn.getAttribute('state'),
    });
  });
  console.table(groupLvlBtnData);
}
