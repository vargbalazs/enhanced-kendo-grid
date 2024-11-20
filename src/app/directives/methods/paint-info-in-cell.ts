import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { InfoTooltip } from '../interfaces/info-tooltip.interface';

// paints an info icon in the given cell
export function paintInfoInCell(
  cell: Element,
  config: EnhancedGridConfig,
  tooltip: InfoTooltip
) {
  // create the wrapper div
  const iconDiv = document.createElement('div');
  iconDiv.innerHTML = 'i';
  iconDiv.setAttribute('info-icon', '');
  const rowIndex = +cell.getAttribute('ng-reflect-data-row-index')!;
  const colIndex = +cell.getAttribute('ng-reflect-col-index')!;
  iconDiv.setAttribute('row-index', rowIndex.toString());
  iconDiv.setAttribute('col-index', colIndex.toString());
  iconDiv.classList.add('info-icon');
  // position the icon according to the align of the cell
  if (getComputedStyle(cell).textAlign !== 'right')
    iconDiv.style.left = `${cell.getBoundingClientRect().width - 10}px`;
  // if we are not in edit mode, then append the icon to the cell
  if (!cell.classList.contains('k-grid-edit-cell')) cell.appendChild(iconDiv);
}
