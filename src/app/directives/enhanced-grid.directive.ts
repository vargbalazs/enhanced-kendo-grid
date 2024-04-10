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
import { RowCalculation } from './interfaces/row-calculation.interface';
import { ColumnCalculation } from './interfaces/column-calculation.interface';
import { FormErrorMessage } from './interfaces/form-error-message.interface';

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

  // input property for row calculation
  @Input() rowCalculation: RowCalculation = {
    titleField: '',
    calculatedFields: [],
    calculatedRows: [],
  };

  // input property for column calculation
  @Input() colCalculation: ColumnCalculation = { calculatedColumns: [] };

  // input property for showing th cell error messages
  @Input() showCellErrorMessages: boolean = false;

  // input property for the error messages
  @Input() errorMessages: FormErrorMessage[] = [];

  // event emitter for updating the 'selectedKeys' input
  @Output() selectedKeysChange = new EventEmitter<CellSelectionItem[]>();

  // event emitter for updating the 'aggregates' input
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  // cell was double clicked
  private cellDblClicked: boolean = false;

  // listener for filter row
  private filterButtonListener: () => void = () => {};

  // listener for grid scrolling
  private gridScrollListener: () => void = () => {};

  // listener for scrollend event
  private gridScrollEndListener: () => void = () => {};

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
        // if it is a calculated row and the column is editable, don't allow editing
        if (
          this.grid.activeCell.dataItem.calculated &&
          !this.config.nonEditableColumns.some(
            (nec) => nec.index === this.grid.activeCell.colIndex
          )
        ) {
          this.grid.closeCell();
        }
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
        // reset styling for non-edited cells
        // methods.setNonEditableCellStyle(this.config, 'on');
      }
    );

    // store whether the grid is sortable
    this.config.sortable = this.grid.sortable;

    // store, if the grid is a calc grid
    this.config.calculatedGrid =
      this.rowCalculation.calculatedRows.length > 0 ||
      this.colCalculation.calculatedColumns.length > 0;

    // store row calc settings
    this.config.rowCalculation = this.rowCalculation;

    // check the settings
    methods.checkCalcRowSettings(this.config);

    // store column calc settings
    this.config.colCalculation = this.colCalculation;

    // if the grid is a calculated grid, then sorting, filtering, paging, grouping shouldn't be enabled
    if (
      this.config.calculatedGrid &&
      (this.grid.sortable ||
        this.grid.filterable ||
        this.grid.pageable ||
        this.grid.groupable)
    ) {
      console.error(
        `A calculated grid can't be sorted, filtered, paged or grouped.`
      );
      this.grid.sortable = false;
      this.config.sortable = false;
      this.grid.filterable = false;
      this.grid.pageable = false;
      this.grid.groupable = false;
    }

    // store the showCellErrorMessages input property
    this.config.showCellErrorMessages = this.showCellErrorMessages;

    // store the error messages
    this.config.errorMessages = this.errorMessages;

    // reset the grid
    this.resetState();
  }

  ngAfterViewInit(): void {
    // get the columns in the order as in the template, without hidden ones
    this.config.columns = (<ColumnComponent[]>(
      this.grid.columnList.toArray()
    )).filter((c) => !c.hidden);

    // get the non-editable columns
    (<ColumnComponent[]>this.grid.columnList.toArray()).forEach((c, i) => {
      if (!c.editable)
        this.config.nonEditableColumns.push({ column: c, index: i });
    });

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

    // check the settings for calculated columns
    methods.checkCalcColSettings(this.config);

    // if we have column calculations and these are valid
    if (
      this.colCalculation.calculatedColumns.length > 0 &&
      !this.config.wrongCalcColSettings
    ) {
      setTimeout(() => {
        methods.updateCalculatedColumns(this.config);
      });
    }

    // if we have row calculations and these are valid
    if (
      this.rowCalculation.calculatedRows.length > 0 &&
      !this.config.wrongCalcRowSettings
    ) {
      setTimeout(() => {
        methods.insertCalculatedRows(
          this.rowCalculation,
          this.config,
          this.grid
        );
        methods.updateCalculatedRows(this.config);
      });
    }

    // if filtering is enabled then add event listener to the filter row in order to
    // set the non-editable cell styles
    if (this.grid.filterable) {
      const filterButtons = (<HTMLElement>(
        this.config.gridElRef.nativeElement
      )).querySelectorAll('kendo-grid-filter-cell-operators button');
      filterButtons.forEach((el) => {
        this.filterButtonListener = this.renderer2.listen(el, 'click', (e) => {
          // methods.setNonEditableCellStyle(this.config, 'on');
        });
      });
    }

    // reposition the error tooltip, if scrolling
    methods.scrollErrorTooltip(
      this.config,
      this.renderer2,
      this.gridScrollListener
    );

    // create the selected area div
    methods.createSelectedArea(this.renderer2, this.config);

    // handle selected area if scrolling from a frozen column
    methods.registerScrollEndListener(
      this.config,
      this.renderer2,
      this.gridScrollEndListener
    );
  }

  ngOnDestroy(): void {
    this.config.cellClose$.unsubscribe();
    this.config.cellClick$.unsubscribe();
    this.config.pageChange$.unsubscribe();
    this.config.columnClick$.unsubscribe();
    this.filterButtonListener();
    this.gridScrollListener();
    this.gridScrollEndListener();
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
    // reset styling of non-edited cells - this is also part of the general reset, but we need it one more time
    // methods.setNonEditableCellStyle(this.config, 'on');

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
      methods.scrollToColumnKeyboard(this.config, this.grid, e, this.renderer2);

    // store the grid body if we click on a cell (grid body can't be undefined, if we want to copy just one cell)
    methods.storeGridBody(this.config, e);
  }

  @HostListener('click', ['$event'])
  onClick(e: PointerEvent) {
    // if we clicked the header, the filter row, or any other part of the grid except a data cell
    // then reset styling for non-edited cells
    if (!this.grid.activeCell || !this.grid.activeCell?.dataItem) {
      // methods.setNonEditableCellStyle(this.config, 'on');
    }
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
    // store the grid body if we click on a cell (grid body can't be undefined, if we want to copy just one cell)
    methods.storeGridBody(this.config, e);
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

        // set the border and shadow of the selected area, but only if we are not after a double click
        if (!this.cellDblClicked) {
          this.config.selectedArea.style.border =
            this.config.selectedAreaBorder;
          this.config.selectedArea.style.boxShadow =
            this.config.selectedAreaBoxShadow;
        }

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
    // methods.setNonEditableCellStyle(this.config, 'on');
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
    // if the grid is a calc grid and we have calc rows, then reset the stlye of the calc rows
    if (
      this.config.calculatedGrid &&
      this.config.rowCalculation.calculatedRows.length > 0
    )
      methods.overrideCalculatedCellStyle(this.config);
  }

  // emits the appr. events in order to show the selection on the grid
  updateState() {
    this.selectedKeysChange.emit(this.config.selectedCells);
    this.aggregatesChange.emit(this.config.aggregates);
  }
}
