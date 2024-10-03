import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// drawes an overlay over the grid, if rows are expanding/collapsing via group lvl button click
export function drawOverlay(
  config: EnhancedGridConfig,
  renderer2: Renderer2,
  visibility: 'on' | 'off'
) {
  const overlay = renderer2.createElement('div') as HTMLDivElement;
  const grid = <HTMLElement>config.gridElRef.nativeElement;
  const gridParent = grid.parentElement!;
  if (visibility === 'on') {
    renderer2.addClass(overlay, 'overlay');
    //renderer2.setStyle(overlay, 'width', config.overlay.originalWidth);
    renderer2.setStyle(overlay, 'width', getComputedStyle(grid).width);
    renderer2.setStyle(overlay, 'height', config.overlay.originalHeight);
    renderer2.appendChild(grid, overlay);
    config.overlay.element = overlay;
  } else {
    renderer2.removeChild(grid, config.overlay.element);
  }
}
