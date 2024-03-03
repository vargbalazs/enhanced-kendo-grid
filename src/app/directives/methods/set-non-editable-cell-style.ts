// adds or removes the style for an editable cell for the selected cells
// this is needed, because we have to set the background for an editable cell as !important, because all other cells have to have a
// default white background because of the frozen columns feature (in order to hide the non-frozen columns when scrolling)
// and so if we select a non-editable cell, the background won't change, unless we remove the non-editable class

import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

export function setNonEditableCellStyle(
  config: EnhancedGridConfig,
  toggle: 'on' | 'off'
) {
  if (toggle === 'off') {
    for (let i = 0; i <= config.selectedCells.length - 1; i++) {
      if (!config.columns[config.selectedCells[i].columnKey].editable) {
        const target = config.gridBody.querySelector(
          `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
        );
        target?.classList.remove('non-editable');
      }
    }
  }
  if (toggle === 'on') {
    for (let i = 0; i <= config.selectedCells.length - 1; i++) {
      if (!config.columns[config.selectedCells[i].columnKey].editable) {
        const target = config.gridBody.querySelector(
          `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
        );
        target?.classList.add('non-editable');
      }
    }
  }
}
