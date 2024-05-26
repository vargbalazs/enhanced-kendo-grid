import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// initializes the error tooltip div
export function toggleErrorTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect,
  toggle: 'on' | 'off'
) {
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // if form is invalid
  if (toggle === 'on') {
    methods.initErrorTooltip(config);
    // append to the grid content
    gridContent.appendChild(config.errorToolTip);
    // set position
    methods.setPositionErrorTooltip(config, rect);
    // store the initial left and top pos for scrolling
    config.errorTooltipLeft = config.errorToolTip.getBoundingClientRect().left;
    config.errorTooltipTop = config.errorToolTip.getBoundingClientRect().top;
    // whether we are in a frozen column
    config.errorTooltipInFrozenColumn =
      config.editedColIndex <= config.frozenColumns.length - 1;
  } else {
    if (gridContent.contains(config.errorToolTip))
      gridContent.removeChild(config.errorToolTip);
    config.errorTooltipInFrozenColumn = false;
  }
}
