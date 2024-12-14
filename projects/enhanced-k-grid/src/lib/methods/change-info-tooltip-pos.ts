import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// changes the pos of the info tooltip
export function changeInfoTooltipPos(
  config: EnhancedGridConfig,
  pos: 'left' | 'right' | 'bottom' | 'bottom-left' | 'bottom-right',
  rect: DOMRect,
  gridContent: Element,
  infoTooltip: HTMLDivElement
) {
  switch (pos) {
    case 'left':
      infoTooltip.style.left = `${
        rect.left +
        gridContent.scrollLeft -
        infoTooltip.getBoundingClientRect().width -
        gridContent.getBoundingClientRect().left -
        10
      }px`;
      infoTooltip.style.top = `${
        rect.top -
        gridContent.getBoundingClientRect().top -
        (infoTooltip.getBoundingClientRect().height - rect.height) / 2 +
        gridContent.scrollTop
      }px`;
      infoTooltip.classList.remove(config.infoTooltipPos);
      config.infoTooltipPos = pos;
      infoTooltip.classList.add(config.infoTooltipPos);
      break;
    case 'bottom':
      infoTooltip.style.top = `${
        rect.top -
        gridContent.getBoundingClientRect().top +
        rect.height +
        gridContent.scrollTop +
        10
      }px`;
      infoTooltip.style.left = `${
        rect.left -
        gridContent.getBoundingClientRect().left -
        (infoTooltip.getBoundingClientRect().width - rect.width) / 2 +
        gridContent.scrollLeft
      }px`;
      infoTooltip.classList.remove(config.infoTooltipPos);
      config.infoTooltipPos = pos;
      infoTooltip.classList.add(config.infoTooltipPos);
      break;
    case 'bottom-left':
      infoTooltip.style.top = `${
        rect.top - gridContent.getBoundingClientRect().top
      }px`;
      infoTooltip.classList.remove(config.infoTooltipPos);
      config.infoTooltipPos = pos;
      infoTooltip.classList.add(config.infoTooltipPos);
      break;
  }
}
