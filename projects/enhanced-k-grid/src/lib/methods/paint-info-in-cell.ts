import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// paints an info icon in the given cell
export function paintInfoInCell(cell: Element, config: EnhancedGridConfig) {
  // get grid content
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // create the wrapper div
  const iconDiv = document.createElement('div');
  iconDiv.innerHTML = 'i';
  iconDiv.setAttribute('info-icon', '');
  iconDiv.classList.add('info-icon');
  // set the position
  iconDiv.style.top = `${
    cell.getBoundingClientRect().top - gridContent.getBoundingClientRect().top
  }px`;
  iconDiv.style.left = `${
    cell.getBoundingClientRect().left - gridContent.getBoundingClientRect().left
  }px`;
  // append to the grid content
  gridContent.appendChild(iconDiv);
}
