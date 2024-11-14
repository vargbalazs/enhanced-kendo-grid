import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { InfoTooltip } from '../interfaces/info-tooltip.interface';
import * as methods from './index';

// initializes the info tooltips
export function initInfoTooltip(
  infoTooltips: InfoTooltip[],
  config: EnhancedGridConfig
) {
  infoTooltips.forEach((tooltip) => {
    const cell = methods.getInfoCell(
      tooltip.columnField,
      tooltip.rowField,
      tooltip.rowValue,
      config
    );
    if (cell) methods.paintInfoInCell(cell, config);
  });
}
