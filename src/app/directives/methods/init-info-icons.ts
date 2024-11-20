import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { InfoTooltip } from '../interfaces/info-tooltip.interface';
import * as methods from './index';

// initializes the info icons
export function initInfoIcons(
  infoTooltips: InfoTooltip[],
  config: EnhancedGridConfig
) {
  // first get the info icons, and if we have any, then remove them from the DOM
  const infoIcons = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('[info-icon]');
  if (infoIcons.length > 0) infoIcons.forEach((icon) => icon.remove());

  // add the info icons to the corresponding cells
  infoTooltips.forEach((tooltip) => {
    const cell = methods.getInfoCell(
      tooltip.columnField,
      tooltip.rowField,
      tooltip.rowValue,
      config
    );
    if (cell) methods.paintInfoInCell(cell, config, tooltip);
  });
}
