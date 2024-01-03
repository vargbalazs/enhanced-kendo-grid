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

  // changes the focus with tab to the next cell
  @Input() changeCellFocusWithTab: boolean = false;

  // enables selecting cells with shift
  @Input() selectingWithShift: boolean = false;

  // enables selecting cells with the mouse
  @Input() selectingWithMouse: boolean = false;

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

    // create the selected area div
    methods.createSelectedArea(this.renderer2, this.element, this.config);
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
      // display the selected area div
      this.config.selectedArea.style.display = 'block';

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

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: any) {
    // if selecting with mouse is allowed
    if (this.selectingWithMouse) {
      // start selecting
      this.resetState();
      this.config.isMouseDown = true;
      this.config.selectingWithMouse = true;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e: any) {
    // if selecting with mouse is allowed
    if (this.selectingWithMouse) {
      // end of selecting
      this.config.isMouseDown = false;
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(e: MouseEvent) {
    // if selecting with mouse is allowed
    if (this.selectingWithMouse) {
      // this event handler is needed, if we move out of the table we set everything to default
      const target = (<HTMLElement>e.target).parentElement;
      if (
        this.config.isMouseDown &&
        !target?.hasAttribute('ng-reflect-data-row-index')
      ) {
        this.config.isMouseDown = false;
        this.resetState();
      }
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    // if selecting with mouse is allowed
    if (this.selectingWithMouse) {
      if (this.config.isMouseDown) {
        e.preventDefault();
        // get the target
        const target = (<HTMLElement>e.target).parentElement;
        // if we move on a data cell
        if (
          target?.hasAttribute('ng-reflect-data-row-index') &&
          target?.hasAttribute('ng-reflect-col-index')
        ) {
          // get the indexes
          const dataRowIndex = +target.attributes.getNamedItem(
            'ng-reflect-data-row-index'
          )!.value;
          const columnIndex = +target.attributes.getNamedItem(
            'ng-reflect-col-index'
          )!.value;
        }
      }
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
