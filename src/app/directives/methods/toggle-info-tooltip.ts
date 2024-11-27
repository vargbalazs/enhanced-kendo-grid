import { ElementRef } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { InfoTooltip } from '../interfaces/info-tooltip.interface';
import * as methods from './index';

// shows the info tooltip
export function toggleInfoTooltip(
  tooltip: InfoTooltip,
  config: EnhancedGridConfig,
  toggle: 'on' | 'off'
) {
  // get the grid content el
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  if (toggle === 'on') {
    // get the corresponding cell and info icon
    const cell = methods.getInfoCell(
      tooltip.columnField,
      tooltip.rowField,
      tooltip.rowValue,
      config
    )!;
    const infoIcon = cell.querySelector('[info-icon]')!;
    const rect = infoIcon.getBoundingClientRect();
    // create the info tooltip element
    //const infoTooltip = document.createElement('div');
    const infoTooltip = config.infoTooltipContainer;
    infoTooltip.setAttribute('infotooltip', '');
    infoTooltip.classList.add('tooltip', 'common', 'info');
    if (typeof tooltip.content === 'string') {
      infoTooltip.innerHTML = `
        <div class="content">
            ${tooltip.content}
        </div>
        <i></i>`;
    } else {
    }
    gridContent.appendChild(infoTooltip);
    // set the position of the tooltip
    methods.setPositionInfoTooltip(config, rect, gridContent, infoTooltip);
  } else {
    const infoTooltip = gridContent.querySelector('[infotooltip]')!;
    gridContent.removeChild(infoTooltip);
  }
}
