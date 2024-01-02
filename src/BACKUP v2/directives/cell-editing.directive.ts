import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CellCloseEvent,
  CellSelectionItem,
  ColumnComponent,
  CreateFormGroupArgs,
  GridComponent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs';
import { CellData } from '../interfaces/celldata.interface';
import { Aggregate } from '../interfaces/aggregate.interface';
import { resetSelectedArea } from '../helpers/helpers';

@Directive({
  selector: '[cellEditing]',
})
export class CellEditingDirective implements OnInit, OnDestroy {
  @Input() selectedCells: CellSelectionItem[] = [];
  @Input() cellEditingFormGroup!: (args: CreateFormGroupArgs) => FormGroup;
  @Input() selectedCellDatas: CellData[] = [];
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
  @Input() selectedArea!: HTMLDivElement;

  @Output() selectedCellsChange = new EventEmitter<CellSelectionItem[]>();
  @Output() selectedCellDatasChange = new EventEmitter<CellData[]>();
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  private noFocusingWithArrowKeys: boolean = false;
  private key: string = '';
  private dataRowIndex!: number;
  private columnIndex!: number;
  private originalDataItem: any;
  private dataRowIndexBeforeFiltering = 0;
  private arrowKeys: string[] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ];
  private notAllowedKeys: string[] = [
    ...this.arrowKeys,
    'Enter',
    'Escape',
    'Alt',
    'AltGraph',
    'Shift',
    'Control',
    'Backspace',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'ScrollLock',
    'CapsLock',
    'NumLock',
    'Pause',
    'Meta',
    'ContextMenu',
    'Insert',
    'Home',
    'End',
    'PageUp',
    'PageDown',
  ];
  private cellClose$!: Subscription;
  private columns!: ColumnComponent[];
  private gridData: any[] = [];

  constructor(private grid: GridComponent) {}

  ngOnInit(): void {
    this.cellClose$ = this.grid.cellClose.subscribe((cellCloseEvent) => {
      this.onCellClose(cellCloseEvent);
    });
    this.gridData = (<GridDataResult>this.grid.data).data;
    this.gridData.forEach((row, index) => (row.dataRowIndex = index));
  }

  ngOnDestroy(): void {
    this.cellClose$.unsubscribe();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // exit on tab
    if (e.key === 'Tab') return;

    // exit also on ctrl and alt
    if (e.ctrlKey || e.altKey) return;

    // get the columns in the order as in the template, without hidden ones
    this.columns = (<ColumnComponent[]>this.grid.columnList.toArray()).filter(
      (c) => !c.hidden
    );

    // if we enter in edit mode or leave it with enter
    if (
      this.grid.activeCell.dataItem && // cell is a data cell
      e.key === 'Enter' &&
      !this.isColumnNotEditable(
        this.columns[this.grid.activeCell.colIndex].field
      ) // column is editable
    ) {
      this.noFocusingWithArrowKeys = !this.noFocusingWithArrowKeys;
      this.resetState();
      this.storeOriginalValues();
    }

    // if we enter in edit mode via typing any character, except enter or arrow keys or any other not allowed keys
    if (
      this.grid.activeCell.dataItem && // we presss a key on a data cell
      !this.isColumnNotEditable(
        this.columns[this.grid.activeCell.colIndex].field
      ) && // column is editable
      !this.notAllowedKeys.includes(e.key) && // the pressed key is a 'regular' one
      !this.grid.isEditingCell() // we are not in edit mode elsewhere in the grid
    ) {
      // get the column field name (key)
      this.key = this.columns[this.grid.activeCell.colIndex].field;
      // if the given field is an object, then we are in a list, so we need the arrow keys to navigate through it
      // otherwise we can move the focus to the next cell
      this.noFocusingWithArrowKeys = this.key.includes('.');
      // store the original values (if we hit escape, we can set the value to the old one)
      this.storeOriginalValues();
      // set the field value to undefined - with this we start fresh in the cell
      // if the field is an object, then we have to modify the key to the object,
      // because the key is a property of that object
      if (this.key.includes('.'))
        this.key = this.key.substring(0, this.key.indexOf('.'));
      this.grid.activeCell.dataItem[this.key] = undefined;
      // step into edit mode
      this.editCell();
    }

    // if we are in edit mode (not via enter key), then if we press the arrow keys, we change the focus
    // if we hold shift, the focus should remain in the cell
    if (
      this.grid.isEditingCell() &&
      !this.noFocusingWithArrowKeys &&
      !e.shiftKey
    ) {
      if (this.arrowKeys.includes(e.key)) {
        this.grid.closeCell();
        this.grid.focusCell(
          this.grid.activeCell.rowIndex,
          this.grid.activeCell.colIndex
        );
      }
    }
  }

  @HostListener('click', ['$event'])
  onClick() {
    // if we click an other data cell except the edited one, then close it
    if (this.grid.activeCell.dataItem) {
      const sameCell =
        this.columnIndex === this.grid.activeCell.colIndex &&
        this.dataRowIndex === this.grid.activeCell.dataRowIndex;
      if (!sameCell) {
        this.grid.closeCell();
        this.noFocusingWithArrowKeys = false;
      }
    }
  }

  @HostListener('dblclick', ['$event'])
  onDblClick() {
    if (this.grid.activeCell.dataItem) {
      this.noFocusingWithArrowKeys = true;
      // store the original values
      this.storeOriginalValues();
      // mark cell as selected
      this.selectedCells.push({
        itemKey: this.grid.activeCell.dataRowIndex,
        columnKey: this.grid.activeCell.colIndex,
      });
      // step into edit mode
      this.editCell();
    }
  }

  editCell() {
    // put the cell in edit mode with the appr. data item
    const args: CreateFormGroupArgs = {
      dataItem: this.grid.activeCell.dataItem,
      isNew: false,
      sender: this.grid,
      rowIndex: this.grid.activeCell.rowIndex,
    };
    this.grid.editCell(
      this.grid.activeCell.dataRowIndex,
      this.grid.activeCell.colIndex,
      this.cellEditingFormGroup(args)
    );
  }

  onCellClose(args: CellCloseEvent): void {
    // if cell data is invalid, then put the cell back in edit mode
    // with this, we are preventing to focus out (except if we entered in edit mode with Enter)
    // in case of Enter, the old value gets written back
    if (!(<FormGroup>args.formGroup).valid) {
      args.formGroup = this.originalDataItem;
      this.grid.editCell(
        this.dataRowIndex,
        this.columnIndex,
        this.cellEditingFormGroup(args)
      );
    }
    // if we hit escape, then restore the original value
    if ((<KeyboardEvent>args.originalEvent)?.key === 'Escape') {
      // if some filters are active
      if (this.grid.filter?.filters) {
        // gridData will have only the filtered rows
        // dataRowIndex will have the correct row index according to the filtered data
        const gridData = (<GridDataResult>this.grid.data).data;
        gridData[this.dataRowIndex] = this.originalDataItem;
        // get the dataRowIndex according to the original (not filtered) data source
        this.dataRowIndexBeforeFiltering = this.gridData.find(
          (row) => row.id === this.originalDataItem.id
        ).dataRowIndex;
        // use this dataRowIndex to set the originalDataItem back
        this.gridData[this.dataRowIndexBeforeFiltering] = this.originalDataItem;
      } else {
        this.gridData[this.dataRowIndex] = this.originalDataItem;
      }
      this.noFocusingWithArrowKeys = false;
      this.resetState();
    }
  }

  storeOriginalValues() {
    // before editing, we store all the relevant original values
    this.dataRowIndex = this.grid.activeCell.dataRowIndex;
    this.columnIndex = this.grid.activeCell.colIndex;
    this.originalDataItem = {};
    Object.assign(this.originalDataItem, this.grid.activeCell.dataItem);
  }

  resetState() {
    this.selectedCells = [];
    this.selectedCellsChange.emit(this.selectedCells);
    this.selectedCellDatas = [];
    this.selectedCellDatasChange.emit(this.selectedCellDatas);
    this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
    this.aggregatesChange.emit(this.aggregates);
    // reset the selected area div
    resetSelectedArea(this.selectedArea);
  }

  isColumnNotEditable(fieldName: string) {
    const columns = <ColumnComponent[]>this.grid.columnList.toArray();
    const nonEditableColumns = columns.filter((c) => !c.editable);
    return nonEditableColumns.some((c) => c.field === fieldName);
  }
}
