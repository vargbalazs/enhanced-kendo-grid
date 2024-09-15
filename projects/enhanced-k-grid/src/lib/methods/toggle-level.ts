import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// toggles the state for all group indicators of a given level
export function toggleLevel(
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
