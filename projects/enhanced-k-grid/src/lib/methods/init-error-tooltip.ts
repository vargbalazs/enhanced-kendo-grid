import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// initializes the error tooltip
export function initErrorTooltip(config: EnhancedGridConfig) {
  // proceed the error messages
  let errors = '';
  for (let i = 0; i <= config.errors.length - 1; i++) {
    errors += `<li>${config.errors[i]}</li>`;
  }
  // set the tooltip styles and inner html
  config.errorToolTip.classList.add('tooltip', 'common');
  config.errorToolTip.innerHTML = `
    <div class="content">
        <div class="error">
          <ul class="error-list">
            ${errors}
          </ul>
        </div>
    </div>
    <i></i>`;
  config.errorToolTip.setAttribute('id', 'error-tooltip');
  // setting z-index is always needed
  config.errorToolTip.style.zIndex = '99';
}
