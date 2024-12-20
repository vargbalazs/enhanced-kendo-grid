import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// sets the position of an info tooltip
export function setPositionInfoTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect,
  gridContent: Element,
  infoTooltip: HTMLDivElement
) {
  // define the rects for easier access
  const infoTooltipRect = infoTooltip.getBoundingClientRect();
  const gridContentRect = gridContent.getBoundingClientRect();
  // reset first
  methods.resetPos(infoTooltip);
  // calculate the left and top values as if the tooltip pos were top
  const left =
    rect.left -
    gridContent.getBoundingClientRect().left -
    (infoTooltip.getBoundingClientRect().width - rect.width) / 2 +
    gridContent.scrollLeft;
  const top =
    rect.top -
    gridContent.getBoundingClientRect().top -
    infoTooltip.getBoundingClientRect().height -
    10 +
    gridContent.scrollTop;
  // the default info tooltip pos is top
  config.infoTooltipPos = 'top';
  infoTooltip.classList.add(config.infoTooltipPos);
  methods.changeInfoTooltipPos(config, 'top', rect, gridContent, infoTooltip);
  // if the info icon is on the very right of the grid, then the pos of the tooltip should be left
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
    // if the info icon is on the very right top corner of the grid, then the pos of the tooltip should be also left
    // but with different classes and positions
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
    // if the info icon is on the very right bottom corner of the grid, then the pos of the tooltip should be also left
    // but with different classes and positions
    if (
      infoTooltip.getBoundingClientRect().bottom >
      gridContent.getBoundingClientRect().bottom
    ) {
      methods.changeInfoTooltipPos(
        config,
        'top-left',
        rect,
        gridContent,
        infoTooltip
      );
    }
    return;
  }
  // if the info icon is on the very left of the grid, then the pos of the tooltip should be right
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
    // if the info icon is on the very left top corner of the grid, then the pos of the tooltip should be also right
    // but with different classes and positions
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
    // if the info icon is on the very left bottom corner of the grid, then the pos of the tooltip should be also right
    // but with different classes and positions
    if (
      infoTooltip.getBoundingClientRect().bottom >
      gridContent.getBoundingClientRect().bottom
    ) {
      methods.changeInfoTooltipPos(
        config,
        'top-right',
        rect,
        gridContent,
        infoTooltip
      );
    }
    return;
  }
  // if no matching for all other cases, then the info tooltip pos should be bottom
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
