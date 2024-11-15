import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { InfoTooltip } from '../interfaces/info-tooltip.interface';

// paints an info icon in the given cell
export function paintInfoInCell(
  cell: Element,
  config: EnhancedGridConfig,
  tooltip: InfoTooltip
) {
  // get grid content
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // create the wrapper div
  const iconDiv = document.createElement('div');
  iconDiv.innerHTML = 'i';
  iconDiv.setAttribute('info-icon', '');
  const rowIndex = +cell.getAttribute('ng-reflect-data-row-index')!;
  const colIndex = +cell.getAttribute('ng-reflect-col-index')!;
  iconDiv.setAttribute('row-index', rowIndex.toString());
  iconDiv.setAttribute('col-index', colIndex.toString());
  iconDiv.setAttribute(
    'start-top',
    `${
      cell.getBoundingClientRect().top - gridContent.getBoundingClientRect().top
    }`
  );
  iconDiv.setAttribute(
    'start-left',
    `${
      cell.getBoundingClientRect().left -
      gridContent.getBoundingClientRect().left
    }`
  );
  iconDiv.classList.add('info-icon');
  // set the position
  // if the icon is in a frozen column
  if (colIndex < config.frozenColumns.length - 1) {
    iconDiv.style.position = 'fixed';
    iconDiv.style.top = `${
      cell.getBoundingClientRect().top - gridContent.getBoundingClientRect().top
    }px`;
    iconDiv.style.left = `${
      cell.getBoundingClientRect().left -
      gridContent.getBoundingClientRect().left
    }px`;
  } else {
    iconDiv.style.top = `${
      cell.getBoundingClientRect().top - gridContent.getBoundingClientRect().top
    }px`;
    iconDiv.style.left = `${
      cell.getBoundingClientRect().left -
      gridContent.getBoundingClientRect().left
    }px`;
  }
  // append to the grid content
  gridContent.appendChild(iconDiv);
}
