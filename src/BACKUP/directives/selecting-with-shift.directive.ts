import {
  AfterViewInit,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
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
import { markCellsAsSelected } from '../helpers/helpers';

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
    private selectingWithMouseDir: SelectingWithMouseDirective
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
    // if we press any key, but not shift, then reset the state
    if (!e.shiftKey) {
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
      let target = <HTMLElement>e.target;
      const gridBody = target.parentElement?.parentElement;
      // store the first selected cell, it's position and it's value
      if (this.selectedCells.length === 0) {
        this.selectedCells.push({
          itemKey: this.grid.activeCell.dataRowIndex,
          columnKey: this.grid.activeCell.colIndex,
        });
        this.selectingWithMouseDir.setRectValues(
          this.firstSelectedCellRect,
          target
        );
        // get the column field name (key)
        this.key = this.columns[this.grid.activeCell.colIndex].field;
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
      this.selectingWithMouseDir.setRectValues(
        this.lastSelectedCellRect,
        target
      );

      // mark the cells as selected and update the state only if we move to another cell
      if (
        this.rowIndex != this.lastSelectedCell.itemKey ||
        this.colIndex != this.lastSelectedCell.columnKey
      ) {
        this.markCellsAsSelected(this.lastSelectedCell);
        this.calculateAggregates();
        this.updateState();
        this.rowIndex = this.lastSelectedCell.itemKey;
        this.colIndex = this.lastSelectedCell.columnKey;
        // update also the selected area
        this.selectingWithMouseDir.resizeSelectedArea.bind(this)(
          this.lastSelectedCell
        );
        this.selectedArea.style.border = this.selectedAreaBorder;
      }
    }
  }

  // marks the cells as selected in every direction
  markCellsAsSelected(lastSelectedCell: CellSelectionItem) {
    const firstCell = this.getFirstSelectedCell();
    const rowOffset = Math.abs(
      firstCell.itemKey - this.lastSelectedCell.itemKey
    );
    const columnOffset = Math.abs(
      firstCell.columnKey - this.lastSelectedCell.columnKey
    );
    const verticalDirection =
      firstCell.itemKey < this.lastSelectedCell.itemKey ? 1 : -1;
    const horizontalDirection =
      firstCell.columnKey < this.lastSelectedCell.columnKey ? 1 : -1;
    // we always start with the first selected cell, because we can not only add, but remove too
    this.selectedCells = [firstCell];
    this.selectedCellDatas = [this.selectedCellDatas[0]];
    for (let i = 0; i <= columnOffset; i++) {
      for (let j = 0; j <= rowOffset; j++) {
        if (
          !this.cellIsSelected({
            itemKey: firstCell.itemKey + j * verticalDirection,
            columnKey: firstCell.columnKey + i * horizontalDirection,
          })
        ) {
          this.selectedCells = [
            ...this.selectedCells,
            {
              itemKey: firstCell.itemKey + j * verticalDirection,
              columnKey: firstCell.columnKey + i * horizontalDirection,
            },
          ];
          this.key =
            this.columns[firstCell.columnKey + i * horizontalDirection].field;
          this.selectedCellDatas = [
            ...this.selectedCellDatas,
            {
              value:
                this.gridData[firstCell.itemKey + j * verticalDirection][
                  this.key
                ],
            },
          ];
        }
      }
    }
  }

  // returns a boolean, indicating if a cell is selected or not
  cellIsSelected(cell: CellSelectionItem): boolean {
    return this.selectedCells.some(
      (item) =>
        item.itemKey === cell.itemKey && item.columnKey === cell.columnKey
    );
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

  // simple method for getting the first selected cell
  getFirstSelectedCell(): CellSelectionItem {
    return this.selectedCells[0];
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
    this.selectingWithMouseDir.resetSelectedArea();
  }

  // emits the appr. events in order to show the selection on the grid
  updateState() {
    this.selectedCellsChange.emit(this.selectedCells);
    this.selectedCellDatasChange.emit(this.selectedCellDatas);
    this.aggregatesChange.emit(this.aggregates);
  }

  // calculates the aggregated values
  calculateAggregates() {
    this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
    // sum
    this.aggregates.sum = this.selectedCellDatas.reduce(
      (acc, data) => (isFinite(+data.value) ? acc + +data.value : acc),
      0
    );
    // avg
    let countOfNumberValues = 0;
    this.selectedCellDatas.map((cellData) => {
      if (isFinite(+cellData.value)) countOfNumberValues++;
    });
    this.aggregates.avg =
      countOfNumberValues > 0 ? this.aggregates.sum / countOfNumberValues : 0;
    // count
    this.aggregates.count = this.selectedCellDatas.length;
    // min
    let min: CellData = { value: 0 };
    this.aggregates.min = +this.selectedCellDatas.reduce((prev, curr) => {
      if (isFinite(+prev.value) && isFinite(+curr.value)) {
        +prev.value < +curr.value
          ? (min.value = +prev.value)
          : (min.value = +curr.value);
      }
      return min;
    }).value;
    // max
    let max: CellData = { value: 0 };
    this.aggregates.max = +this.selectedCellDatas.reduce((prev, curr) => {
      if (isFinite(+prev.value) && isFinite(+curr.value)) {
        +prev.value > +curr.value
          ? (max.value = +prev.value)
          : (max.value = +curr.value);
      }
      return max;
    }).value;
  }
}
