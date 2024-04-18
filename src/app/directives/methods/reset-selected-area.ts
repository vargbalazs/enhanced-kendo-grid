import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// reset the styles of the selected area
export function resetSelectedArea(
  selectedArea: HTMLDivElement,
  config: EnhancedGridConfig
) {
  selectedArea.style.width = '0px';
  selectedArea.style.height = '0px';
  selectedArea.style.border = 'none';
  selectedArea.style.zIndex = '99';
  (<HTMLElement>selectedArea.firstChild)?.classList.remove('dashed-border');
}
