import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  CellSelectionItem,
  ColumnComponent,
  CreateFormGroupArgs,
  GridComponent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { FormGroup } from '@angular/forms';
import { EnhancedGridConfig } from './classes/enhanced-grid-config.class';
import { Aggregate } from './interfaces/aggregate.interface';
import * as methods from './methods';

@Directive({
  selector: '[enhancedGrid]',
})
export class EnhancedGridDirective implements OnInit, OnDestroy, AfterViewInit {
  // config object for all the related data for the directive to work
  private config: EnhancedGridConfig;

  // div element for the selected area
  @Input() selectedArea: HTMLDivElement = document.createElement('div');

  // changes the focus with tab to the next cell
  @Input() changeCellFocusWithTab: boolean = false;

  // enables selecting cells with shift
  @Input() selectingWithShift: boolean = false;

  // input for the in-cell-editing directive
  @Input() kendoGridInCellEditing!: (args: CreateFormGroupArgs) => FormGroup;

  // object for aggregated values of the selected data
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  // event emitter for updating the 'selectedKeys' input
  @Output() selectedKeysChange = new EventEmitter<CellSelectionItem[]>();

  // event emitter for updating the 'aggregates' input
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  constructor(
    private grid: GridComponent,
    private renderer2: Renderer2,
    private element: ElementRef
  ) {
    this.config = new EnhancedGridConfig();
  }

  ngOnInit(): void {
    // get the data of the grid
    this.config.gridData = (<GridDataResult>this.grid.data).data;

    // add a field 'dataRowIndex' to the grid data - this is needed, because if we are filtering, we have to store the 'dataRowIndex'
    // of the data item before filtering
    this.config.gridData.forEach((row, index) => (row.dataRowIndex = index));

    // subscribe to the cellClose event
    this.config.cellClose$ = this.grid.cellClose.subscribe((cellCloseEvent) => {
      methods.cellClose(
        cellCloseEvent,
        this.config,
        this.grid,
        this.kendoGridInCellEditing,
        this.resetState.bind(this)
      );
    });

    // add the selected area div before the grid
    const selectedArea = this.renderer2.createElement('div');
    this.renderer2.addClass(selectedArea, 'selected-area');
    this.renderer2.insertBefore(
      this.element.nativeElement.parentNode,
      selectedArea,
      this.element.nativeElement.nextSibling
    );

    this.config.selectedArea = selectedArea;
  }

  ngAfterViewInit(): void {
    // get the columns in the order as in the template, without hidden ones
    this.config.columns = (<ColumnComponent[]>(
      this.grid.columnList.toArray()
    )).filter((c) => !c.hidden);
  }

  ngOnDestroy(): void {
    this.config.cellClose$.unsubscribe();
  }

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
        this.resetState.bind(this),
        this.kendoGridInCellEditing
      );
    }

    // if selecting with shift is allowed
    if (this.selectingWithShift) {
      methods.selectWithShift(
        e,
        this.grid,
        this.config,
        this.resetState.bind(this),
        this.updateState.bind(this)
      );
    }
  }

  @HostListener('click', ['$event'])
  onClick() {
    // if editing is allowed
    if (!!this.kendoGridInCellEditing) {
      // if we click an other data cell except the edited one, then close it
      methods.cellClickAfterEditing(
        this.grid,
        this.config,
        this.resetState.bind(this)
      );
    }
  }

  @HostListener('dblclick', ['$event'])
  onDblClick() {
    // if editing is allowed
    if (this.kendoGridInCellEditing) {
      // sets the current cell into edit mode
      methods.cellDblClick(this.grid, this.config, this.kendoGridInCellEditing);
    }
  }

  // resets the state of the grid
  resetState() {
    this.config.selectedCells = [];
    this.selectedKeysChange.emit(this.config.selectedCells);
    this.config.selectedCellDatas = [];
    this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
    this.aggregatesChange.emit(this.aggregates);
    this.config.selectingWithMouse = false;
    // reset the selected area div
    methods.resetSelectedArea(this.config.selectedArea);
  }

  // emits the appr. events in order to show the selection on the grid
  updateState() {
    this.selectedKeysChange.emit(this.config.selectedCells);
    this.aggregatesChange.emit(this.config.aggregates);
  }
}
