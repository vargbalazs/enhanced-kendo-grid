import {
  AfterViewInit,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  CellSelectionItem,
  ColumnComponent,
  GridComponent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { SelectingWithMouseDirective } from './selecting-with-mouse.directive';
import { CellData } from '../interfaces/celldata.interface';
import { Aggregate } from '../interfaces/aggregate.interface';
import { Rect } from '../interfaces/rect.interface';
import {
  calculateAggregates,
  markCellsAsSelected,
  resetSelectedArea,
  resizeSelectedArea,
  setRectValues,
} from '../helpers/helpers';
import { CopyPasteDirective } from './copy-paste.directive';

@Directive({
  selector: '[selectingWithShift]',
})
export class SelectingWithShiftDirective implements OnInit, AfterViewInit {
  @Input() selectedCells: CellSelectionItem[] = [];
  @Input() selectedArea!: HTMLDivElement;
  @Input() selectedCellDatas: CellData[] = [];
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  @Output() selectedCellsChange = new EventEmitter<CellSelectionItem[]>();
  @Output() selectedCellDatasChange = new EventEmitter<CellData[]>();
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  private arrowKeys: string[] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ];
  private lastSelectedCell!: CellSelectionItem;
  private rowIndex = -1;
  private colIndex = -1;
  private firstSelectedCellRect: Rect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  private lastSelectedCellRect: Rect = { left: 0, top: 0, width: 0, height: 0 };
  private selectedAreaBorder = '';
  private gridData: any[] = [];
  private key: string = '';
  private columns!: ColumnComponent[];

  constructor(
    private grid: GridComponent,
    private renderer2: Renderer2,
    private selectingWithMouseDir: SelectingWithMouseDirective,
    private copyPasteDir: CopyPasteDirective
  ) {}

  ngOnInit(): void {
    // store the border of the selected area and use it later
    this.selectedAreaBorder = this.selectingWithMouseDir.selectedAreaBorder;
    // get the grid data
    this.gridData = (<GridDataResult>this.grid.data).data;
  }

  ngAfterViewInit(): void {
    // get the columns in the order as in the template, without hidden ones
    this.columns = (<ColumnComponent[]>this.grid.columnList.toArray()).filter(
      (c) => !c.hidden
    );
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // if we have copied something to the clipboard
    if (this.copyPasteDir.dataCopied) {
      // we need the focus shadow back, if we press anything
      this.renderer2.removeClass(
        this.copyPasteDir.startingCell,
        'no-focus-shadow'
      );
      // if no selection, then reset the selected area
      // this is the case, if we copy only one cell
      if (this.selectedCells.length == 0) resetSelectedArea(this.selectedArea);
      // by pressing esc keep the selection, but remove the dashed border
      if (e.key === 'Escape') {
        this.renderer2.removeClass(this.selectedArea, 'dashed-border');
        this.copyPasteDir.dataCopied = false;
        //navigator.clipboard.writeText(' ');
        return;
      }
    }
    // if we just alt+tab, do nothing
    if (e.key === 'Alt' || (e.altKey && e.key === 'Tab')) return;
    // if we press any key, but not shift and control, then reset the state
    // reset also, if we selected some cells with the mouse previously
    if (!e.shiftKey && !e.ctrlKey) {
      this.resetState();
    } else {
      if (this.selectingWithMouseDir.selectingWithMouse && !e.ctrlKey)
        this.resetState();
    }

    // if we move back from the header row, we can only move back to the same column index, which we had
    // when we moved to the header row, otherwise we cancel the selection
    if (
      e.shiftKey &&
      e.key === 'ArrowDown' &&
      this.grid.activeCell.dataRowIndex === -1
    ) {
      if (
        this.grid.activeCell.colIndex != this.getLastSelectedCell()?.columnKey
      ) {
        this.resetState();
      }
    }

    // if we aren't in edit mode and hold the shift key and press any arrow (selecting)
    if (
      !this.grid.isEditingCell() &&
      e.shiftKey &&
      this.arrowKeys.includes(e.key) &&
      this.grid.activeCell.dataRowIndex != -1 // header
    ) {
      // if we copied something to the clipboard, then cancel the copying
      if (this.copyPasteDir.dataCopied) {
        this.renderer2.removeClass(this.selectedArea, 'dashed-border');
        this.renderer2.removeClass(
          this.copyPasteDir.startingCell,
          'no-focus-shadow'
        );
        this.copyPasteDir.dataCopied = false;
      }
      let target = <HTMLElement>e.target;
      const gridBody = target.parentElement?.parentElement;
      // store the first selected cell, it's position and it's value
      if (this.selectedCells.length === 0) {
        this.selectedCells.push({
          itemKey: this.grid.activeCell.dataRowIndex,
          columnKey: this.grid.activeCell.colIndex,
        });
        setRectValues(this.firstSelectedCellRect, target);
        // get the column field name (key)
        this.key = this.columns[this.grid.activeCell.colIndex].field;
        // if in the cell we have an object
        if (this.key.includes('.')) {
          const objectKey = this.key.substring(0, this.key.indexOf('.'));
          const propertyKey = this.key.substring(this.key.indexOf('.') + 1);
          this.selectedCellDatas.push({
            value: this.grid.activeCell.dataItem[objectKey][propertyKey],
          });
        } else
          this.selectedCellDatas.push({
            value: this.grid.activeCell.dataItem[this.key],
          });
      }
      switch (e.key) {
        case 'ArrowRight':
          // exit if we reach one of the edges
          if (this.rightEndReached()) return;
          this.lastSelectedCell = {
            itemKey: this.grid.activeCell.dataRowIndex,
            columnKey: this.grid.activeCell.colIndex + 1,
          };
          break;
        case 'ArrowLeft':
          // exit if we reach one of the edges
          if (this.leftEndReached()) return;
          this.lastSelectedCell = {
            itemKey: this.grid.activeCell.dataRowIndex,
            columnKey: this.grid.activeCell.colIndex - 1,
          };
          break;
        case 'ArrowUp':
          // exit if we reach one of the edges
          if (this.topEndReached()) return;
          this.lastSelectedCell = {
            itemKey: this.grid.activeCell.dataRowIndex - 1,
            columnKey: this.grid.activeCell.colIndex,
          };
          break;
        case 'ArrowDown':
          // exit if we reach one of the edges
          if (this.bottomEndReached()) return;
          this.lastSelectedCell = {
            itemKey: this.grid.activeCell.dataRowIndex + 1,
            columnKey: this.grid.activeCell.colIndex,
          };
          break;
      }
      // query for the last sel. cell and override target, because the target of the keydown event isn't the last sel. cell
      target = gridBody!.querySelector(
        `[ng-reflect-data-row-index="${this.lastSelectedCell.itemKey}"][ng-reflect-col-index="${this.lastSelectedCell.columnKey}"]`
      )!;
      // store the position of the last selected cell
      setRectValues(this.lastSelectedCellRect, target);

      // mark the cells as selected and update the state only if we move to another cell
      if (
        this.rowIndex != this.lastSelectedCell.itemKey ||
        this.colIndex != this.lastSelectedCell.columnKey
      ) {
        const { selectedCells, selectedCellDatas } = markCellsAsSelected(
          this.lastSelectedCell,
          this.selectedCells,
          this.selectedCellDatas,
          this.columns,
          this.gridData
        );
        this.selectedCells = selectedCells;
        this.selectedCellDatas = selectedCellDatas;
        this.aggregates = calculateAggregates(
          this.aggregates,
          this.selectedCellDatas
        );
        this.updateState();
        this.rowIndex = this.lastSelectedCell.itemKey;
        this.colIndex = this.lastSelectedCell.columnKey;
        // update also the selected area
        resizeSelectedArea(
          this.lastSelectedCell,
          this.selectedCells,
          this.selectedArea,
          this.firstSelectedCellRect,
          this.lastSelectedCellRect
        );
        this.selectedArea.style.border = this.selectedAreaBorder;
      }
    }
  }

  // indicates, if we reached the right end of the data table
  rightEndReached(): boolean {
    return this.grid.activeCell.colIndex >= this.grid.columns.length - 1;
  }

  // indicates, if we reached the left end of the data table
  leftEndReached(): boolean {
    return this.grid.activeCell.colIndex === 0;
  }

  // indicates, if we reached the top of the data table
  topEndReached(): boolean {
    return this.grid.activeCell.dataRowIndex < 1;
  }

  // indicates, if we reached the bottom end of the data table
  bottomEndReached(): boolean {
    return (
      this.grid.activeCell.dataRowIndex + 1 ===
      (<GridDataResult>this.grid.data).total
    );
  }

  // simple method for getting the last selected cell
  getLastSelectedCell(): CellSelectionItem {
    return this.selectedCells[this.selectedCells.length - 1];
  }

  // resets the state
  resetState() {
    this.selectedCells = [];
    this.selectedCellsChange.emit(this.selectedCells);
    this.selectedCellDatas = [];
    this.selectedCellDatasChange.emit(this.selectedCellDatas);
    this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
    this.aggregatesChange.emit(this.aggregates);
    // reset the selected area div
    resetSelectedArea(this.selectedArea);
    this.selectingWithMouseDir.selectingWithMouse = false;
  }

  // emits the appr. events in order to show the selection on the grid
  updateState() {
    this.selectedCellsChange.emit(this.selectedCells);
    this.selectedCellDatasChange.emit(this.selectedCellDatas);
    this.aggregatesChange.emit(this.aggregates);
  }
}
