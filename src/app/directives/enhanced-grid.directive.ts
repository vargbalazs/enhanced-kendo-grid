import {
  AfterViewInit,
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
import { FormGroup } from '@angular/forms';
import { EnhancedGridConfig } from './interfaces/enhanced-grid-config.interface';
import { Aggregate } from './interfaces/aggregate.interface';
import * as methods from './methods';

@Directive({
  selector: '[enhancedGrid]',
})
export class EnhancedGridDirective implements OnInit, OnDestroy, AfterViewInit {
  // config object for all the related data for the directive to work
  private config: EnhancedGridConfig = {};

  // div element for the selected area
  @Input() selectedArea: HTMLDivElement = document.createElement('div');

  // storing the form group for editing a cell
  @Input() cellEditingFormGroup!: (args: CreateFormGroupArgs) => FormGroup;

  // changes the focus with tab to the next cell
  @Input() changeCellFocusWithTab: boolean = false;

  // input for the in-cell-editing directive
  @Input() kendoGridInCellEditing: any;

  // object for aggregated values of the selected data
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  // event emitter for updating the 'selectedCells' input
  @Output() selectedCellsChange = new EventEmitter<CellSelectionItem[]>();

  // event emitter for updating the 'aggregates' input
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  constructor(private grid: GridComponent) {}

  ngOnInit(): void {
    // get the data of the grid
    this.config.gridData = (<GridDataResult>this.grid.data).data;

    // add a field 'dataRowIndex' to the grid data - this is needed, because if we are filtering, we have to store the 'dataRowIndex'
    // of the data item before filtering
    this.config.gridData.forEach((row, index) => (row.dataRowIndex = index));

    // subscribe to the cellClose event
    this.config.cellClose$ = this.grid.cellClose.subscribe((cellCloseEvent) => {
      //this.onCellClose(cellCloseEvent);
    });
  }

  ngAfterViewInit(): void {
    // get the columns in the order as in the template, without hidden ones
    this.config.columns = (<ColumnComponent[]>(
      this.grid.columnList.toArray()
    )).filter((c) => !c.hidden);
  }

  ngOnDestroy(): void {
    this.config.cellClose$!.unsubscribe();
  }

  // #region keydown

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // if changing focus with tab is allowed
    if (this.changeCellFocusWithTab)
      methods.changeCellFocusWithTab(this.grid, e);

    // if editing is allowed
    if (this.kendoGridInCellEditing) {
      methods.editCellOnKeyDown(
        this.config,
        e,
        this.grid,
        this.resetState.bind(this)
      );
    }
  }

  // #endregion

  // resets the state of the grid
  resetState() {
    this.config.selectedCells = [];
    this.selectedCellsChange.emit(this.config.selectedCells);
    this.config.selectedCellDatas = [];
    this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
    this.aggregatesChange.emit(this.aggregates);
    // reset the selected area div
    methods.resetSelectedArea(this.selectedArea);
  }
}
