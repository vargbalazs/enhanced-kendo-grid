import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// if we have copied something to the clipboard, by pressing esc keep the selection, but remove the dashed border
export function cancelCopying(
  config: EnhancedGridConfig,
  renderer2: Renderer2
) {
  // if we have copied something to the clipboard, keep the selection, but remove the dashed border
  if (config.dataCopied) {
    renderer2.removeClass(config.selectedArea.firstChild, 'dashed-border');
    renderer2.setStyle(
      config.selectedArea,
      'boxShadow',
      config.selectedAreaBoxShadow
    );
    // methods.removeDashedBorder(config);
    renderer2.removeClass(config.firstSelectedCellElement, 'no-focus-shadow');
    config.dataCopied = false;
    navigator.clipboard.writeText('');
    return;
  }
}
