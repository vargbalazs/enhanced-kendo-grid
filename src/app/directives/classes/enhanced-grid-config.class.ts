import {
  CellSelectionItem,
  ColumnComponent,
  PagerSettings,
  SortSettings,
} from '@progress/kendo-angular-grid';
import { Rect } from '../interfaces/rect.interface';
import { Subscription } from 'rxjs';
import { CellData } from '../interfaces/celldata.interface';
import { Aggregate } from '../interfaces/aggregate.interface';
import { ElementRef } from '@angular/core';
import { FrozenColumn } from '../interfaces/frozencolumn.interface';
import { NonEditableColumn } from '../interfaces/non-editable-column.interface';
import { RowCalculation } from '../interfaces/row-calculation.interface';
import { ColumnStyle } from '../interfaces/column-style.interface';
import { ColumnCalculation } from '../interfaces/column-calculation.interface';
import { FormGroup } from '@angular/forms';

export class EnhancedGridConfig {
  // the data of the grid - just one page, if paging is enabled
  public gridData: any[] = [];

  // the full grid data
  public fullGridData: any[] = [];

  // the columns of the grid
  public columns: ColumnComponent[] = [];

  // non-editable columns
  public nonEditableColumns: NonEditableColumn[] = [];

  // the first selected cell in a selection
  public firstSelectedCell: CellSelectionItem = {};

  // the last selected cell in a selection
  public lastSelectedCell: CellSelectionItem = {};

  // the position and size of the first selected cell
  public firstSelectedCellRect: Rect = { left: 0, top: 0, width: 0, height: 0 };

  // the position and size of the last selected cell
  public lastSelectedCellRect: Rect = { left: 0, top: 0, width: 0, height: 0 };

  // temporary variable to store the row index of a given cell
  public rowIndex: number = -1;

  // temporary variable to store the column index of a given cell
  public colIndex: number = -1;

  // temporary variable to store the row index of an edited cell
  public editedRowIndex: number = -1;

  // temporary variable to store the row index of an edited cell, if we filtered or sortet the data before
  public editedRowIndexFilterOrSort: number = -1;

  // temporary variable to store the column index of an edited cell
  public editedColIndex: number = -1;

  // column field name
  public fieldName: string = '';

  // is the left mouse button pressed down
  public isMouseDown: boolean = false;

  // we are selecting cells with the mouse
  public selectingWithMouse: boolean = false;

  // the selected data was copied to the clipboard
  public dataCopied: boolean = false;

  // can we change the focus with the arrow keys
  public noFocusingWithArrowKeys: boolean = false;

  // if we edit a cell, first we store the original data item of the row
  public originalDataItem: any;

  // the original row index before we start filter the grid
  public dataRowIndexBeforeFiltering: number = -1;

  // subscription for the cell close evenet in order to fire our own cell close event
  public cellClose$: Subscription = new Subscription();

  // subscription for the cell click evenet in order to override it
  public cellClick$: Subscription = new Subscription();

  // subscription for the page change event
  public pageChange$: Subscription = new Subscription();

  // subscription for column header click
  public columnClick$: Subscription = new Subscription();

  // array for the selected cells
  public selectedCells: CellSelectionItem[] = [];

  // array for the selected datas in the selected cells
  public selectedCellDatas: CellData[] = [];

  // object for aggregated values of the selected data
  public aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  // div element for the selected area
  public selectedArea: HTMLDivElement = document.createElement('div');

  // html element of the first selected cell
  public firstSelectedCellElement: any;

  // store the initial border of the selected area
  public selectedAreaBorder: string = '';

  // the copied data to the clipboard
  public copiedDataToClipboard: string = '';

  // the grid body html element
  public gridBody: HTMLElement = document.createElement('div');

  // array of frozen columns
  public frozenColumns: FrozenColumn[] = [];

  // element ref of the grid
  public gridElRef: ElementRef = new ElementRef(null);

  // if the grid is sortable
  public sortable: SortSettings = false;

  // if the grid is a calc grid
  public calculatedGrid: boolean = false;

  // if the grid should be recalculated
  public shouldRecalculate: boolean = false;

  // store the row calculation settings
  public rowCalculation: RowCalculation = {
    titleField: '',
    calculatedFields: [],
    calculatedRows: [],
  };

  // store the css classes of all columns
  public columnStyles: ColumnStyle[] = [];

  // indicates, whether we have a wrong setup for calculated rows
  public wrongCalcRowSettings: boolean = false;

  // store the column calculation settings
  public colCalculation: ColumnCalculation = { calculatedColumns: [] };

  // indicates, whether we have a wrong setup for calculated columns
  public wrongCalcColSettings: boolean = false;

  // the form group, which belongs to an edited cell
  public cellEditingFormGroup: FormGroup = new FormGroup({});

  // subscription for status changing of an edited form group
  public statusChanges$: Subscription = new Subscription();
}
