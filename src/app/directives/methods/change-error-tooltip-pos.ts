import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// changes the pos of an error tooltip
export function changeErrorTooltipPos(
  config: EnhancedGridConfig,
  pos: 'left' | 'right' | 'bottom',
  rect: DOMRect,
  gridContent: Element
) {
  switch (pos) {
    case 'left':
      config.errorToolTip.style.left = `${
        rect.left +
        gridContent.scrollLeft -
        config.errorToolTip.getBoundingClientRect().width -
        gridContent.getBoundingClientRect().left -
        10
      }px`;
      config.errorToolTip.style.top = `${
        rect.top -
        gridContent.getBoundingClientRect().top -
        (config.errorToolTip.getBoundingClientRect().height - rect.height) / 2 +
        gridContent.scrollTop
      }px`;
      config.errorToolTip.classList.remove(config.errorTooltipPos);
      config.errorTooltipPos = pos;
      config.errorToolTip.classList.add(config.errorTooltipPos);
      break;
    case 'right':
      config.errorToolTip.style.left = `${
        rect.right +
        gridContent.scrollLeft -
        gridContent.getBoundingClientRect().left +
        10
      }px`;
      config.errorToolTip.style.top = `${
        rect.top -
        gridContent.getBoundingClientRect().top -
        (config.errorToolTip.getBoundingClientRect().height - rect.height) / 2 +
        gridContent.scrollTop
      }px`;
      config.errorToolTip.classList.remove(config.errorTooltipPos);
      config.errorTooltipPos = pos;
      config.errorToolTip.classList.add(config.errorTooltipPos);
      break;
    case 'bottom':
      config.errorToolTip.style.top = `${
        rect.top -
        gridContent.getBoundingClientRect().top +
        rect.height +
        gridContent.scrollTop +
        10
      }px`;
      config.errorToolTip.classList.remove(config.errorTooltipPos);
      config.errorTooltipPos = pos;
      config.errorToolTip.classList.add(config.errorTooltipPos);
      break;
  }
}
