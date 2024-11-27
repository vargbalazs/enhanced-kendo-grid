import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// sets the position of an info tooltip
export function setPositionInfoTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect,
  gridContent: Element,
  infoTooltip: HTMLDivElement
) {
  methods.resetPos(infoTooltip);
  // default pos is top
  config.infoTooltipPos = 'top';
  infoTooltip.classList.add(config.infoTooltipPos);
  infoTooltip.style.left = `${
    rect.left -
    gridContent.getBoundingClientRect().left -
    (infoTooltip.getBoundingClientRect().width - rect.width) / 2 +
    gridContent.scrollLeft
  }px`;
  infoTooltip.style.top = `${
    rect.top -
    gridContent.getBoundingClientRect().top -
    infoTooltip.getBoundingClientRect().height -
    10 +
    gridContent.scrollTop
  }px`;
  // if the pos should be left
  if (
    infoTooltip.getBoundingClientRect().right >
    gridContent.getBoundingClientRect().right
  ) {
    methods.changeInfoTooltipPos(
      config,
      'left',
      rect,
      gridContent,
      infoTooltip
    );
    // right corner
    if (
      infoTooltip.getBoundingClientRect().top <
      gridContent.getBoundingClientRect().top
    ) {
      methods.changeInfoTooltipPos(
        config,
        'bottom-left',
        rect,
        gridContent,
        infoTooltip
      );
    }
    return;
  }
  // if the pos should be right
  if (
    infoTooltip.getBoundingClientRect().left <
    gridContent.getBoundingClientRect().left
  ) {
    methods.changeInfoTooltipPos(
      config,
      'right',
      rect,
      gridContent,
      infoTooltip
    );
    // left corner
    if (
      infoTooltip.getBoundingClientRect().top <
      gridContent.getBoundingClientRect().top
    ) {
      methods.changeInfoTooltipPos(
        config,
        'bottom-right',
        rect,
        gridContent,
        infoTooltip
      );
    }
    return;
  }
  // if the pos should be bottom
  if (
    infoTooltip.getBoundingClientRect().top <
    gridContent.getBoundingClientRect().top
  ) {
    methods.changeInfoTooltipPos(
      config,
      'bottom',
      rect,
      gridContent,
      infoTooltip
    );
    return;
  }
}
