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

  // enables copying data to the clipboard
  @Input() enableCopying: boolean = false;

  // enables pasting data from the clipboard
  @Input() enablePasting: boolean = false;

  // input for the in-cell-editing directive
  @Input() kendoGridInCellEditing!: (args: CreateFormGroupArgs) => FormGroup;

  // object for aggregated values of the selected data
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  // input for the full grid data
  @Input() kendoGridBinding!: any[];

  // input for the frozen columns
  @Input() frozenColumns: string[] = [];

  // event emitter for updating the 'selectedKeys' input
  @Output() selectedKeysChange = new EventEmitter<CellSelectionItem[]>();

  // event emitter for updating the 'aggregates' input
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  // cell was double clicked
  private cellDblClicked: boolean = false;

  constructor(
    private grid: GridComponent,
    private renderer2: Renderer2,
    private element: ElementRef
  ) {
    this.config = new EnhancedGridConfig();
    // get the element ref of the grid
    this.config.gridElRef = element;
  }

  ngOnInit(): void {
    // get the data of the grid
    // if paging is enabled, this gets only the first page data
    this.config.gridData = (<GridDataResult>this.grid.data).data;

    // get the full grid data
    this.config.fullGridData = this.kendoGridBinding;

    // add a field 'dataRowIndex' to the grid data - this is needed, because if we are filtering, we have to store the 'dataRowIndex'
    // of the data item before filtering
    this.config.gridData.forEach((row, index) => (row.dataRowIndex = index));
    this.config.fullGridData.forEach(
      (row, index) => (row.dataRowIndex = index)
    );

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

    // subscribe to the cellclick event - with this we override the default kendo logic and close the cell
    // except if we are editing
    this.config.cellClick$ = this.grid.cellClick.subscribe((cellClickEvent) => {
      // if we hit enter, the subscr is being called, but in this case we want to go into edit mode, so we return
      if (cellClickEvent.originalEvent instanceof KeyboardEvent) return;
      // if we double clicked a cell and edit mode is enabled, then enter in edit mode and return
      if (this.cellDblClicked && !!this.kendoGridInCellEditing) {
        this.onDblClick();
        this.cellDblClicked = false;
        return;
      }
      this.grid.closeCell();
      this.resetState();
    });

    // subscribe to the page change event
    this.config.pageChange$ = this.grid.pageChange.subscribe(
      (pageChangeEvent) => {
        // refresh the page data
        this.config.gridData = (<GridDataResult>this.grid.data).data;
      }
    );

    // create the selected area div
    methods.createSelectedArea(this.renderer2, this.element, this.config);

    // store whether the grid is sortable
    this.config.sortable = this.grid.sortable;

    // reset the grid
    this.resetState();
  }

  ngAfterViewInit(): void {
    // get the columns in the order as in the template, without hidden ones
    this.config.columns = (<ColumnComponent[]>(
      this.grid.columnList.toArray()
    )).filter((c) => !c.hidden);

    // get the frozen columns, if any
    methods.populateFrozenColumns(this.config, this.frozenColumns);

    // setTimeout to avoid expr has changed... error
    setTimeout(() => {
      // set the frozen columns (if any)
      if (this.config.frozenColumns.length > 0)
        methods.handleFrozenColumns(this.config);
    });

    // add mousedown eventlistener to the header, because if sorting is enabled and if we are editing, we have to prevent sorting
    if (this.config.sortable) {
      methods.handleSorting(this.config, this.grid);
    }
  }

  ngOnDestroy(): void {
    this.config.cellClose$.unsubscribe();
    this.config.cellClick$.unsubscribe();
    this.config.pageChange$.unsubscribe();
    this.config.columnClick$.unsubscribe();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // if we just alt+tab, do nothing
    if (e.key === 'Alt' || (e.altKey && e.key === 'Tab')) return;

    // reset copying on esc if any (but keep the selection)
    if (this.config.dataCopied && e.key === 'Escape') {
      methods.cancelCopying(this.config, this.renderer2);
      return;
    }

    // general reset
    methods.resetOnKeydown(e, this.resetState.bind(this), this.config);

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
        this.updateState.bind(this),
        this.renderer2
      );
    }

    // if copying is allowed
    if (this.enableCopying) {
      methods.copyDataToClipboard(
        e,
        this.config,
        this.renderer2,
        this.grid,
        this.updateState.bind(this)
      );
    }

    // if pasting is allowed
    if (this.enablePasting) {
      methods.pasteFromClipboard(
        e,
        this.config,
        this.grid,
        this.updateState.bind(this)
      );
    }

    // if there are frozen columns
    if (this.config.frozenColumns.length > 0)
      methods.scrollToColumnKeyboard(this.config, this.grid, e);
  }

  @HostListener('click', ['$event'])
  onClick() {
    this.cellDblClicked = false;
    // if editing is allowed and we aren't selecting with the mouse
    if (!!this.kendoGridInCellEditing && !this.config.selectingWithMouse) {
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
    this.cellDblClicked = true;
    // if editing is allowed
    if (this.kendoGridInCellEditing) {
      // sets the current cell into edit mode
      methods.cellDblClick(this.grid, this.config, this.kendoGridInCellEditing);
      // if we are on laptop and double tap, often the same cell will be selected twice, because mousemove fires twice
      // so we remove one of them (this isn't really needed, but so it's clear)
      if (this.config.selectedCells.length > 1)
        this.config.selectedCells = this.config.selectedCells.splice(1);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: any) {
    // if we double clicked and editing is allowed
    this.cellDblClicked = e.detail == 2;

    // if selecting with mouse is allowed
    if (this.selectingWithMouse) {
      // start selecting
      this.resetState();
      this.config.isMouseDown = true;
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
      // if we move out of the table we set everything to default
      methods.mouseLeaveOnSelecting(e, this.config, this.resetState.bind(this));
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    // if selecting with mouse is allowed
    if (this.selectingWithMouse) {
      if (this.config.isMouseDown) {
        this.config.selectingWithMouse = true;

        // if we are editing an other cell, then close the edited one, else return
        if (this.grid.isEditing()) {
          if (methods.isActiveCellDifferent(this.config, this.grid)) {
            methods.closeEditedCell(
              this.grid,
              this.config,
              this.resetState.bind(this)
            );
          } else {
            return;
          }
        }

        // set the border of the selected area, but only if we are not after a double click
        if (!this.cellDblClicked)
          this.config.selectedArea.style.border =
            this.config.selectedAreaBorder;

        methods.selectWithMouse(
          this.config,
          e,
          this.grid,
          this.updateState.bind(this)
        );
      }
    }
  }

  // resets the state of the grid
  resetState() {
    // if something copied, then remove the dashed borders
    if (this.config.dataCopied) methods.removeDashedBorder(this.config);
    // reset the selected area div
    methods.resetSelectedArea(this.config.selectedArea, this.config);
    // reset styling of non-edited cells
    methods.setNonEditableCellStyle(this.config, 'on');
    this.config.selectedCells = [];
    this.selectedKeysChange.emit(this.config.selectedCells);
    this.config.selectedCellDatas = [];
    this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
    this.aggregatesChange.emit(this.aggregates);
    this.config.selectingWithMouse = false;
    this.config.dataCopied = false;
    // remove the no-focus-shadow class if we copied something - applies only in case of mouse click
    if (this.config.firstSelectedCellElement)
      this.renderer2.removeClass(
        this.config.firstSelectedCellElement,
        'no-focus-shadow'
      );
  }

  // emits the appr. events in order to show the selection on the grid
  updateState() {
    this.selectedKeysChange.emit(this.config.selectedCells);
    this.aggregatesChange.emit(this.config.aggregates);
  }
}
