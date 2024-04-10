import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { Rect } from '../interfaces/rect.interface';

// sets the rect values of a given cell
export function setRectValues(
  cellRect: Rect,
  target: HTMLElement,
  config: EnhancedGridConfig
) {
  // cellRect.left = target?.getClientRects().item(0)!.left;
  // cellRect.top = target?.getClientRects().item(0)!.top;
  // cellRect.width = target?.getClientRects().item(0)!.width;
  // cellRect.height = target?.getClientRects().item(0)!.height;

  // query for the content
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // set the position and dimension
  cellRect.left =
    target.getBoundingClientRect().left -
    gridContent.getBoundingClientRect().left +
    gridContent.scrollLeft;
  cellRect.top =
    target.getBoundingClientRect().top -
    gridContent.getBoundingClientRect().top +
    gridContent.scrollTop;
  cellRect.width = target.getBoundingClientRect().width;
  cellRect.height = target.getBoundingClientRect().height;
}
