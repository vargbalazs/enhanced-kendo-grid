import {
  CellSelectionItem,
  ColumnComponent,
} from '@progress/kendo-angular-grid';
import { Rect } from './rect.interface';
import { Subscription } from 'rxjs';
import { CellData } from './celldata.interface';

export interface EnhancedGridConfig {
  // the data of the grid
  gridData?: any[];

  // the columns of the grid
  columns?: ColumnComponent[];

  // the first selected cell in a selection
  firstSelectedCell?: CellSelectionItem;

  // the last selected cell in a selection
  lastSelectedCell?: CellSelectionItem;

  // the position and size of the first selected cell
  firstSelectedCellRect?: Rect;

  // the position and size of the last selected cell
  lastSelectedCellRect?: Rect;

  // temporary variable to store the row index of a given cell
  rowIndex?: number;

  // temporary variable to store the column index of a given cell
  colIndex?: number;

  // temporary variable to store the row index of an edited cell
  editedRowIndex?: number;

  // temporary variable to store the column index of an edited cell
  editedColIndex?: number;

  // column field name
  fieldName?: string;

  // is the left mouse button pressed down
  isMouseDown?: boolean;

  // we are selecting cells with the mouse
  selectingWithMouse?: boolean;

  // the selected data was copied to the clipboard
  dataCopied?: boolean;

  // can we change the focus with the arrow keys
  noFocusingWithArrowKeys?: boolean;

  // if we edit a cell, first we store the original data item of the row
  originalDataItem?: any;

  // the original row index before we start filter the grid
  dataRowIndexBeforeFiltering?: number;

  // subscription for the cell close evenet in order to fire our own cell close event
  cellClose$?: Subscription;

  // array for the selected cells
  selectedCells?: CellSelectionItem[];

  // array for the selected datas in the selected cells
  selectedCellDatas?: CellData[];
}
