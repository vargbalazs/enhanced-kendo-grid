import { Rect } from '../interfaces/rect.interface';

// sets the rect values of a given cell
export function setRectValues(cellRect: Rect, target: HTMLElement) {
  cellRect.left = target?.getClientRects().item(0)!.left;
  cellRect.top = target?.getClientRects().item(0)!.top;
  cellRect.width = target?.getClientRects().item(0)!.width;
  cellRect.height = target?.getClientRects().item(0)!.height;
}
