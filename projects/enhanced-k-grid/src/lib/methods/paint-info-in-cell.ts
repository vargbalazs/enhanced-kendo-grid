import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// paints an info icon in the given cell
export function paintInfoInCell(cell: Element, config: EnhancedGridConfig) {
  const iconDiv = document.createElement('div');
  iconDiv.innerHTML = 'i';
  iconDiv.setAttribute('info-tooltip', '');
  iconDiv.style.position = 'fixed';
  iconDiv.style.zIndex = '99';
  iconDiv.style.color = 'red';
  iconDiv.style.top = `${cell.getBoundingClientRect().top}px`;
  iconDiv.style.left = `${cell.getBoundingClientRect().left}px`;
  (<HTMLElement>config.gridElRef.nativeElement).appendChild(iconDiv);
}
