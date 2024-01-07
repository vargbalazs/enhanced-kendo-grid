import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// if we move out of the table we set everything to default
export function mouseLeaveOnSelecting(
  e: MouseEvent,
  config: EnhancedGridConfig,
  resetFn: () => void
) {
  const target = <HTMLElement>e.target;
  if (
    config.isMouseDown &&
    !target?.hasAttribute('ng-reflect-data-row-index')
  ) {
    config.isMouseDown = false;
    resetFn();
  }
}
