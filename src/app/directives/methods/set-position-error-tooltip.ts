import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

export function setPositionErrorTooltip(
  config: EnhancedGridConfig,
  rect: DOMRect
) {
  resetPos(config.errorToolTip);
  // default pos is top
  let pos = 'top';
  config.errorToolTip.classList.add(pos);
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
    config.errorToolTip.classList.remove(pos);
    pos = 'left';
    config.errorToolTip.classList.add(pos);
  }
  // if the pos should be right
  if (
    config.errorToolTip.getBoundingClientRect().left <
    gridContent.getBoundingClientRect().left
  ) {
    config.errorToolTip.style.left = `${rect.right + 8}px`;
    config.errorToolTip.style.top = `${
      rect.top - (config.errorToolTip.offsetHeight - rect.height) / 2
    }px`;
    config.errorToolTip.classList.remove(pos);
    pos = 'right';
    config.errorToolTip.classList.add(pos);
  }
}

function resetPos(el: HTMLDivElement) {
  el.classList.remove('top');
  el.classList.remove('left');
  el.classList.remove('right');
}
