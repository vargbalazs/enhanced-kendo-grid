import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// initializes the error tooltip div
export function toggleErrorTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect,
  toggle: 'on' | 'off'
) {
  methods.initErrorTooltip(config);
  // if form is invalid
  if (toggle === 'on') {
    // append to the body
    document.body.appendChild(config.errorToolTip);
    // set position
    methods.setPositionErrorTooltip(config, rect);
    // store the initial left and top pos for scrolling
    config.errorTooltipLeft = config.errorToolTip.getBoundingClientRect().left;
    config.errorTooltipTop = config.errorToolTip.getBoundingClientRect().top;
  } else {
    if (document.body.contains(config.errorToolTip))
      document.body.removeChild(config.errorToolTip);
  }
}
