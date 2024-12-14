import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { InfoTooltip } from '../interfaces/info-tooltip.interface';
import * as methods from './index';

// paints an info icon in the given cell
export function paintInfoInCell(
  cell: Element,
  config: EnhancedGridConfig,
  tooltip: InfoTooltip
) {
  // create the wrapper div
  const iconDiv = document.createElement('div');
  iconDiv.innerHTML = tooltip.icon;
  iconDiv.setAttribute('info-icon', '');
  const rowIndex = +cell.getAttribute('ng-reflect-data-row-index')!;
  const colIndex = +cell.getAttribute('ng-reflect-col-index')!;
  iconDiv.setAttribute('row-index', rowIndex.toString());
  iconDiv.setAttribute('col-index', colIndex.toString());
  iconDiv.classList.add('info-icon');
  // position the icon according to the align of the cell
  if (getComputedStyle(cell).textAlign !== 'right') {
    iconDiv.style.left = `${cell.getBoundingClientRect().width - 10}px`;
    iconDiv.classList.add('right');
  } else {
    iconDiv.classList.add('left');
    //iconDiv.style.left = '5px';
  }
  // add hover and out event listener
  iconDiv.addEventListener('mouseover', (event) => {
    methods.toggleInfoTooltip(tooltip, config, 'on');
  });
  iconDiv.addEventListener('mouseout', (event) => {
    methods.toggleInfoTooltip(tooltip, config, 'off');
  });
  // if we are not in edit mode, then append the icon to the cell
  if (!cell.classList.contains('k-grid-edit-cell')) cell.appendChild(iconDiv);
}
