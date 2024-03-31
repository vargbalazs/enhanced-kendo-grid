import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// changes the pos of an error tooltip
export function changeErrorTooltipPos(
  config: EnhancedGridConfig,
  pos: 'left' | 'right' | 'bottom',
  rect: DOMRect
) {
  switch (pos) {
    case 'left':
      config.errorToolTip.style.left = `${
        rect.left - config.errorToolTip.offsetWidth - 10
      }px`;
      config.errorToolTip.style.top = `${
        rect.top +
        window.scrollY -
        (config.errorToolTip.offsetHeight - rect.height) / 2
      }px`;
      config.errorToolTip.classList.remove(config.errorTooltipPos);
      config.errorTooltipPos = pos;
      config.errorToolTip.classList.add(config.errorTooltipPos);
      break;
    case 'right':
      config.errorToolTip.style.left = `${rect.right + 8}px`;
      config.errorToolTip.style.top = `${
        rect.top +
        window.scrollY -
        (config.errorToolTip.offsetHeight - rect.height) / 2
      }px`;
      config.errorToolTip.classList.remove(config.errorTooltipPos);
      config.errorTooltipPos = pos;
      config.errorToolTip.classList.add(config.errorTooltipPos);
      break;
    case 'bottom':
      config.errorToolTip.style.top = `${
        rect.top + window.scrollY + rect.height + 10
      }px`;
      config.errorToolTip.classList.remove(config.errorTooltipPos);
      config.errorTooltipPos = pos;
      config.errorToolTip.classList.add(config.errorTooltipPos);
      break;
  }
}
