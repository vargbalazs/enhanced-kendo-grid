import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// store the grid body if we click on a cell (grid body can't be undefined, if we want to copy just one cell)
export function storeGridBody(
  config: EnhancedGridConfig,
  e: KeyboardEvent | PointerEvent
) {
  const gridBody = (<HTMLElement>e.target).parentElement?.parentElement;
  if (gridBody?.hasAttribute('kendogridtablebody')) config.gridBody = gridBody!;
}
