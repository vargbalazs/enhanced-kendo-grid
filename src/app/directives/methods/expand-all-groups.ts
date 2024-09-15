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
  // if all group indicators are expanded, then return
  const indicators = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('.group-indicator');
  if (
    Array.from(indicators).every(
      (btn) => btn.getAttribute('state') === 'expanded'
    )
  ) {
    return;
  }
  const maxLevel = config.groupLevelButtons.at(-1)?.level!;
  for (let i = 0; i <= groupBtns.length - 1; i++) {
    // first set the expanded state both in the dom and in the config class
    const btn = groupBtns.item(i);
    btn.setAttribute('state', 'expanded');
    const groupBtn = config.groupLevelButtons.find(
      (btn) => btn.level === i + 1
    )!;
    groupBtn.state = 'expanded';
  }
  // do the expanding
  // it can be, that not all 3 levels are present, in this case we have to handle this
  if (maxLevel === 1) {
    methods.toggleLevel(config, 1, 'expanded', renderer2);
    // checkStatesViaConsol(config);
    return;
  }
  if (maxLevel === 2) {
    methods.drawOverlay(config, renderer2, 'on');
    methods.toggleLevel(config, 1, 'expanded', renderer2);
    setTimeout(() => {
      methods.toggleLevel(config, 2, 'expanded', renderer2);
      methods.drawOverlay(config, renderer2, 'off');
    }, 700);
    return;
  }
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
