import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// initializes the error tooltip
export function initErrorTooltip(config: EnhancedGridConfig) {
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
}
