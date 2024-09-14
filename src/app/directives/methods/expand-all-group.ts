import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// expands all groups of a grid
export function expandAllGroups(
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // get all the group lvl btns
  const groupBtns = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('.group-level-btn');
  // loop through the buttons and expand it, if the state is collapsed
  // but break after the first collapsed btn, because we will expand all the next buttons after that
  for (let i = 0; i <= groupBtns.length - 1; i++) {
    const btn = groupBtns.item(i);
    if (btn.getAttribute('state') === 'collapsed') {
      const level = +btn.getAttribute('level')!;
      // first set the expanded state both in the dom and in the config class
      btn.setAttribute('state', 'expanded');
      const groupBtn = config.groupLevelButtons.find(
        (btn) => btn.level === level
      )!;
      groupBtn.state = 'expanded';
      // expand this level and all others after that
      switch (level) {
        case 1:
          methods.drawOverlay(config, renderer2, 'on');
          methods.toggleLevel(config, 1, 'expanded', renderer2);
          setTimeout(() => {
            methods.toggleLevel(config, 2, 'expanded', renderer2);
            setTimeout(() => {
              methods.toggleLevel(config, 3, 'expanded', renderer2);
              methods.drawOverlay(config, renderer2, 'off');
              // checkStatesViaConsol(config);
            }, 700);
          }, 700);
          break;
        case 2:
          methods.drawOverlay(config, renderer2, 'on');
          methods.toggleLevel(config, 2, 'expanded', renderer2);
          setTimeout(() => {
            methods.toggleLevel(config, 3, 'expanded', renderer2);
            methods.drawOverlay(config, renderer2, 'off');
            // checkStatesViaConsol(config);
          }, 700);
          break;
        case 3:
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
              methods.toggleLevel(config, 3, 'expanded', renderer2);
              methods.drawOverlay(config, renderer2, 'off');
              // checkStatesViaConsol(config);
            }, 700);
          } else {
            methods.toggleLevel(config, 3, 'expanded', renderer2);
            // checkStatesViaConsol(config);
          }
          break;
      }
      break;
    }
  }
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
