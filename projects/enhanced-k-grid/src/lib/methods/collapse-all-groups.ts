import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// collapse all groups of a grid
export function collapseAllGroups(
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // we have to check only the first group btn
  const firstLvlGroupBtn = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.group-level-btn[level="1"]');
  if (firstLvlGroupBtn?.getAttribute('state') === 'expanded') {
    // first set the collapsed state both in the dom and in the config class
    firstLvlGroupBtn.setAttribute('state', 'collapsed');
    const groupBtn = config.groupLevelButtons.find((btn) => btn.level === 1)!;
    groupBtn.state = 'collapsed';
    const maxLevel = config.groupLevelButtons.at(-1)?.level!;
    let indicators = (<HTMLElement>(
      config.gridElRef.nativeElement
    )).querySelectorAll(
      `.group-indicator[level="${maxLevel.toString()}"][state="expanded"]`
    );
    // if the last btn is expanded or any of the last level indicators is expanded
    if (
      methods.getGroupBtnState(3, config) === 'expanded' ||
      (indicators.length > 0 && maxLevel === 3)
    ) {
      // collapse from last to first
      methods.drawOverlay(config, renderer2, 'on');
      methods.toggleLevel(config, 3, 'collapsed', renderer2);
      setTimeout(() => {
        methods.toggleLevel(config, 2, 'collapsed', renderer2);
        setTimeout(() => {
          methods.toggleLevel(config, 1, 'collapsed', renderer2);
          // checkStatesViaConsol(config);
          methods.drawOverlay(config, renderer2, 'off');
        }, 700);
      }, 700);
      return;
    }
    // if the second one is expanded or any of the second level indicators is expanded
    indicators = (<HTMLElement>config.gridElRef.nativeElement).querySelectorAll(
      `.group-indicator[level="2"][state="expanded"]`
    );
    if (
      methods.getGroupBtnState(2, config) === 'expanded' ||
      indicators.length > 0
    ) {
      methods.drawOverlay(config, renderer2, 'on');
      methods.toggleLevel(config, 2, 'collapsed', renderer2);
      setTimeout(() => {
        methods.toggleLevel(config, 1, 'collapsed', renderer2);
        methods.drawOverlay(config, renderer2, 'off');
        // checkStatesViaConsol(config);
      }, 700);
      return;
    }
    // if none of the above is true, then collapse only the first level
    methods.toggleLevel(config, 1, 'collapsed', renderer2);
    // checkStatesViaConsol(config);
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
