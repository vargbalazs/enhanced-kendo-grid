import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

export function setPositionErrorTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect
) {
  resetPos(config.errorToolTip);
  // query the grid content
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // default pos is top
  config.errorTooltipPos = 'top';
  config.errorToolTip.classList.add(config.errorTooltipPos);
  config.errorToolTip.style.left = `${
    rect.left -
    gridContent.getBoundingClientRect().left -
    (config.errorToolTip.getBoundingClientRect().width - rect.width) / 2 +
    gridContent.scrollLeft
  }px`;
  config.errorToolTip.style.top = `${
    rect.top -
    gridContent.getBoundingClientRect().top -
    config.errorToolTip.getBoundingClientRect().height -
    10 +
    gridContent.scrollTop
  }px`;
  // store scrollLeft, scrollTop
  config.gridScrollLeft = gridContent.scrollLeft;
  config.gridScrollTop = gridContent.scrollTop;
  // get the total width of the frozen columns, if any
  let totalWidthFrozenCol = 0;
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    totalWidthFrozenCol +=
      config.columns[config.frozenColumns[i].columnIndex!].width;
  }
  // if the pos should be left
  if (
    config.errorToolTip.getBoundingClientRect().right >
    gridContent.getBoundingClientRect().right
  ) {
    methods.changeErrorTooltipPos(config, 'left', rect, gridContent);
    // right corner
    if (
      config.errorToolTip.getBoundingClientRect().top <
      gridContent.getBoundingClientRect().top
    ) {
      methods.changeErrorTooltipPos(config, 'bottom-left', rect, gridContent);
    }
    return;
  }
  // if the pos should be right
  if (
    config.errorToolTip.getBoundingClientRect().left <
      gridContent.getBoundingClientRect().left ||
    (config.errorToolTip.getBoundingClientRect().left < totalWidthFrozenCol &&
      config.editedColIndex > config.frozenColumns.length - 1)
  ) {
    methods.changeErrorTooltipPos(config, 'right', rect, gridContent);
    // left corner
    if (
      config.errorToolTip.getBoundingClientRect().top <
      gridContent.getBoundingClientRect().top
    ) {
      methods.changeErrorTooltipPos(config, 'bottom-right', rect, gridContent);
    }
    return;
  }
  // if the pos should be bottom
  if (
    config.errorToolTip.getBoundingClientRect().top <
    gridContent.getBoundingClientRect().top
  ) {
    methods.changeErrorTooltipPos(config, 'bottom', rect, gridContent);
    return;
  }
}

function resetPos(el: HTMLDivElement) {
  el.classList.remove('top');
  el.classList.remove('left');
  el.classList.remove('right');
  el.classList.remove('bottom');
  el.classList.remove('bottom-left');
  el.classList.remove('bottom-right');
}
