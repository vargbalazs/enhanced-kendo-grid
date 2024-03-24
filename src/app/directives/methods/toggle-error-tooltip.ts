import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// initializes the error tooltip div
export function toggleErrorTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect,
  toggle: 'on' | 'off'
) {
  // set the tooltip styles and inner html
  config.errorToolTip.classList.add('tooltip', 'common');
  config.errorToolTip.innerHTML = `
    <div class="content">
        <div class="error">some long long long ssssssssssssssssssssssssssssss error text</div>
    </div>
    <i></i>`;
  config.errorToolTip.setAttribute('id', 'error-tooltip');
  // setting z-index is always needed
  config.errorToolTip.style.zIndex = '99';
  // if form is invalid
  if (toggle === 'on') {
    // append to the body
    document.body.appendChild(config.errorToolTip);
    // set position
    methods.setPositionErrorTooltip(config, rect);
    // store the initial left pos for scrolling
    config.errorTooltipLeft = config.errorToolTip.getBoundingClientRect().left;
  } else {
    if (document.body.contains(config.errorToolTip))
      document.body.removeChild(config.errorToolTip);
  }
}
