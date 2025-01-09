import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// store the grid body if we click on a cell (grid body can't be undefined, if we want to copy just one cell)
export function storeGridBody(
  config: EnhancedGridConfig,
  e: KeyboardEvent | PointerEvent | MouseEvent
) {
  const gridBody = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    '[kendogridtablebody]'
  ) as HTMLElement;
  config.gridBody = gridBody;
}
