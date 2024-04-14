import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// if we move out of the table we set everything to default
export function mouseLeaveOnSelecting(
  e: MouseEvent,
  config: EnhancedGridConfig,
  resetFn: () => void
) {
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;

  console.log(e.pageX, gridContent.getBoundingClientRect().right);

  // if we are selecting and we left the grid on the right side, then repeatedly select the next column of cells and scroll the grid
  if (
    config.isMouseDown &&
    e.pageX > gridContent.getBoundingClientRect().right
  ) {
    const intervalId = setInterval(() => {
      if (config.lastSelectedCell.columnKey < config.columns.length - 1) {
        if (!config.isMouseDown) clearInterval(intervalId);
        console.log('belép');
      }
    }, 500);
  }

  // const target = <HTMLElement>e.target;
  // if (
  //   config.isMouseDown &&
  //   !target?.hasAttribute('ng-reflect-data-row-index')
  // ) {
  //   config.isMouseDown = false;
  //   resetFn();
  // }
}
