import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  CellSelectionItem,
  ColumnComponent,
  CreateFormGroupArgs,
  GridComponent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { Rect } from './interfaces/rect.interface';
import { Subscription } from 'rxjs';
import { CellData } from './interfaces/celldata.interface';
import { Aggregate } from './interfaces/aggregate.interface';
import { FormGroup } from '@angular/forms';
import { changeCellFocusWithTab } from './methods/change-cell-focus-with-tab';

@Directive({
  selector: '[enhancedGrid]',
})
export class EnhancedGridDirective implements OnInit, OnDestroy {
  // #region declarations - private fields

  // the data of the grid
  private gridData: any[] = [];

  // the columns of the grid
  private columns: ColumnComponent[] = [];

  // the first selected cell in a selection
  private firstSelectedCell: CellSelectionItem = {};

  // the last selected cell in a selection
  private lastSelectedCell: CellSelectionItem = {};

  // the position and size of the first selected cell
  private firstSelectedCellRect: Rect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  // the position and size of the last selected cell
  private lastSelectedCellRect: Rect = { left: 0, top: 0, width: 0, height: 0 };

  // temporary variable to store the row index of a given cell
  private rowIndex: number = -1;

  // temporary variable to store the column index of a given cell
  private colIndex: number = -1;

  // column field name
  private fieldName: string = '';

  // is the left mouse button pressed down
  private isMouseDown: boolean = false;

  // we are selecting cells with the mouse
  private selectingWithMouse: boolean = false;

  // the selected data was copied to the clipboard
  private dataCopied: boolean = false;

  // can we change the focus with the arrow keys
  private noFocusingWithArrowKeys: boolean = false;

  // if we edit a cell, first we store the original data item of the row
  private originalDataItem: any;

  // the original row index before we start filter the grid
  private dataRowIndexBeforeFiltering: number = 0;

  // subscription for the cell close evenet in order to fire our own cell close event
  private cellClose$!: Subscription;

  // #endregion

  // #region inputs

  // array for the selected cells
  @Input() selectedCells: CellSelectionItem[] = [];

  // array for the selected datas in the selected cells
  @Input() selectedCellDatas: CellData[] = [];

  // div element for the selected area
  @Input() selectedArea: HTMLDivElement = document.createElement('div');

  // object for aggregated values of the selected data
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  // storing the form group for editing a cell
  @Input() cellEditingFormGroup!: (args: CreateFormGroupArgs) => FormGroup;

  // changes the focus with tab to the next cell
  @Input() changeCellFocusWithTab: boolean = false;

  // #endregion

  // #region outputs

  // event emitter for updating the 'selectedCells' input
  @Output() selectedCellsChange = new EventEmitter<CellSelectionItem[]>();

  // event emitter for updating the 'selectedCellDatas' input
  @Output() selectedCellDatasChange = new EventEmitter<CellData[]>();

  // event emitter for updating the 'aggregates' input
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  // #endregion

  constructor(private grid: GridComponent) {}

  ngOnInit(): void {
    // get the data of the grid
    this.gridData = (<GridDataResult>this.grid.data).data;

    // add a field 'dataRowIndex' to the grid data - this is needed, because if we are filtering, we have to store the 'dataRowIndex'
    // of the data item before filtering
    this.gridData.forEach((row, index) => (row.dataRowIndex = index));
  }

  ngOnDestroy(): void {
    this.cellClose$.unsubscribe();
  }

  // #region keydown

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // if changing focus with tab is allowed
    if (this.changeCellFocusWithTab) changeCellFocusWithTab(this.grid, e);
  }

  // #endregion
}
