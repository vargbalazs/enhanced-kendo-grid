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
  // removes the border classes from the selected cells
  for (let i = 0; i <= config.selectedCells.length - 1; i++) {
    config.gridBody
      .querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      )
      ?.classList.remove('top-shadow');
    config.gridBody
      .querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      )
      ?.classList.remove('bottom-shadow');
    config.gridBody
      .querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      )
      ?.classList.remove('left-shadow');
    config.gridBody
      .querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      )
      ?.classList.remove('right-shadow');
  }
}
