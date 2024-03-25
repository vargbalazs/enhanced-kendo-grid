import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

export function setPositionErrorTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect
) {
  resetPos(config.errorToolTip);
  // default pos is top
  config.errorTooltipPos = 'top';
  config.errorToolTip.classList.add(config.errorTooltipPos);
  config.errorToolTip.style.left = `${
    rect.left - (config.errorToolTip.offsetWidth - rect.width) / 2
  }px`;
  config.errorToolTip.style.top = `${
    rect.top - config.errorToolTip.offsetHeight - 10
  }px`;
  // query the grid content
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // store scrollLeft
  config.gridScrollLeft = gridContent.scrollLeft;
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
    config.errorToolTip.style.left = `${
      rect.left - config.errorToolTip.offsetWidth - 10
    }px`;
    config.errorToolTip.style.top = `${
      rect.top - (config.errorToolTip.offsetHeight - rect.height) / 2
    }px`;
    config.errorToolTip.classList.remove(config.errorTooltipPos);
    config.errorTooltipPos = 'left';
    config.errorToolTip.classList.add(config.errorTooltipPos);
  }
  // if the pos should be right
  if (
    config.errorToolTip.getBoundingClientRect().left <
      gridContent.getBoundingClientRect().left ||
    (config.errorToolTip.getBoundingClientRect().left < totalWidthFrozenCol &&
      config.editedColIndex > config.frozenColumns.length - 1)
  ) {
    config.errorToolTip.style.left = `${rect.right + 8}px`;
    config.errorToolTip.style.top = `${
      rect.top - (config.errorToolTip.offsetHeight - rect.height) / 2
    }px`;
    config.errorToolTip.classList.remove(config.errorTooltipPos);
    config.errorTooltipPos = 'right';
    config.errorToolTip.classList.add(config.errorTooltipPos);
  }
}

function resetPos(el: HTMLDivElement) {
  el.classList.remove('top');
  el.classList.remove('left');
  el.classList.remove('right');
}
