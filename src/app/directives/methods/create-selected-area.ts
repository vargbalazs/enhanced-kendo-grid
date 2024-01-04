import { ElementRef, Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// add the selected area div after the grid
export function createSelectedArea(
  renderer2: Renderer2,
  element: ElementRef,
  config: EnhancedGridConfig
) {
  // create
  const selectedArea = renderer2.createElement('div') as HTMLDivElement;

  // set the default style
  renderer2.addClass(selectedArea, 'selected-area');

  // insert
  renderer2.insertBefore(
    element.nativeElement.parentNode,
    selectedArea,
    element.nativeElement.nextSibling
  );

  config.selectedArea = selectedArea;

  // store the initial border
  config.selectedAreaBorder = getComputedStyle(selectedArea).border;
}
