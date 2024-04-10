import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// add the selected area div after the grid
export function createSelectedArea(
  renderer2: Renderer2,
  config: EnhancedGridConfig
) {
  // create
  const selectedArea = renderer2.createElement('div') as HTMLDivElement;

  // set the default style
  renderer2.addClass(selectedArea, 'selected-area');

  // div in order to have moving dashed borders, when copying
  const clipboardDiv = document.createElement('div');
  selectedArea.appendChild(clipboardDiv);

  // query for the content
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;

  // insert
  // renderer2.insertBefore(
  //   element.nativeElement.parentNode,
  //   selectedArea,
  //   element.nativeElement.nextSibling
  // );

  gridContent.appendChild(selectedArea);

  config.selectedArea = selectedArea;

  // store the initial border and shadow
  config.selectedAreaBorder = getComputedStyle(selectedArea).border;
  config.selectedAreaBoxShadow = getComputedStyle(selectedArea).boxShadow;
}
