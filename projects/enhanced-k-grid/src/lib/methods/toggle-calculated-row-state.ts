import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// toggle state (on click)
export function toggleCalcRowState(
  div: Element,
  renderer2: Renderer2,
  config: EnhancedGridConfig
) {
  const state = div.getAttribute('state');
  const rowName = div.getAttribute('calcRowName')!;
  let icon = '';
  if (state === 'expanded') {
    renderer2.setAttribute(div, 'state', 'collapsed');
    icon = 'add';
    methods.setStateForCalcRow(config, rowName, 'collapsed', renderer2);
    methods.animateTableRows(config, rowName, 'collapsed', renderer2);
  } else {
    renderer2.setAttribute(div, 'state', 'expanded');
    icon = 'remove';
    methods.setStateForCalcRow(config, rowName, 'expanded', renderer2);
    methods.animateTableRows(config, rowName, 'expanded', renderer2);
  }
  renderer2.setProperty(
    div,
    'innerHTML',
    `<span class="material-symbols-outlined">${icon}</span>`
  );
}
