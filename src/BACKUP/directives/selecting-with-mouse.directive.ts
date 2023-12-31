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
import { Rect } from '../interfaces/rect.interface';
import { CellData } from '../interfaces/celldata.interface';
import { Aggregate } from '../interfaces/aggregate.interface';

@Directive({
  selector: '[selectingWithMouse]',
})
export class SelectingWithMouseDirective implements OnInit, AfterViewInit {
  @Input() selectedCells: CellSelectionItem[] = [];
  @Input() selectedArea!: HTMLDivElement;
  @Input() selectedCellDatas: CellData[] = [];
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  @Output() selectedCellsChange = new EventEmitter<CellSelectionItem[]>();
  @Output() selectedCellDatasChange = new EventEmitter<CellData[]>();
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  private isMouseDown = false;
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
  public selectedAreaBorder = '';
  private gridData: any[] = [];
  private key: string = '';
  private columns!: ColumnComponent[];

  constructor(private grid: GridComponent) {}

  ngOnInit(): void {
    // store the border of the selected area and use it later
    this.selectedAreaBorder = getComputedStyle(this.selectedArea).border;
    // reset the selected area
    this.resetSelectedArea();
    // get the grid data
    this.gridData = (<GridDataResult>this.grid.data).data;
  }

  ngAfterViewInit(): void {
    // get the columns in the order as in the template, without hidden ones
    this.columns = (<ColumnComponent[]>this.grid.columnList.toArray()).filter(
      (c) => !c.hidden
    );
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: any) {
    // reset
    this.selectedCells = [];
    this.selectedCellDatas = [];
    this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
    this.isMouseDown = true;
    this.updateState();
    this.resetSelectedArea();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e: any) {
    this.isMouseDown = false;
  }

  // this event handler is needed, if we move out of the table
  // in this case we set everything to default
  @HostListener('mouseleave', ['$event'])
  onMouseLeave(e: MouseEvent) {
    const target = (<HTMLElement>e.target).parentElement;
    if (
      this.isMouseDown &&
      !target?.hasAttribute('ng-reflect-data-row-index')
    ) {
      this.isMouseDown = false;
      this.selectedCells = [];
      this.selectedCellDatas = [];
      this.aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
      this.updateState();
      this.resetSelectedArea();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.isMouseDown) {
      e.preventDefault();
      const target = (<HTMLElement>e.target).parentElement;
      // if we move on a data cell
      if (
        target?.hasAttribute('ng-reflect-data-row-index') &&
        target?.hasAttribute('ng-reflect-col-index')
      ) {
        const dataRowIndex = +target.attributes.getNamedItem(
          'ng-reflect-data-row-index'
        )!.value;
        const columnIndex = +target.attributes.getNamedItem(
          'ng-reflect-col-index'
        )!.value;
        // store the first selected cell, it's position and it's value
        if (this.selectedCells.length === 0) {
          this.selectedCells.push({
            itemKey: dataRowIndex,
            columnKey: columnIndex,
          });
          this.setRectValues(this.firstSelectedCellRect, target);
          // get the column field name (key)
          this.key = this.columns[this.grid.activeCell.colIndex].field;
          this.selectedCellDatas.push({
            value: this.grid.activeCell.dataItem[this.key],
          });
        }
        // store the last selected cell and it's position
        this.lastSelectedCell = {
          itemKey: dataRowIndex,
          columnKey: columnIndex,
        };
        this.setRectValues(this.lastSelectedCellRect, target);
        // mark the cells as selected and update the state only if we move to another cell
        if (
          this.rowIndex != this.lastSelectedCell.itemKey ||
          this.colIndex != this.lastSelectedCell.columnKey
        ) {
          this.markCellsAsSelected(this.lastSelectedCell);
          this.calculateAggregates();
          // update only, if we are in another cell
          if (this.selectedCells.length >= 1) this.updateState();
          this.rowIndex = dataRowIndex;
          this.colIndex = columnIndex;
          // update also the selected area
          this.resizeSelectedArea(this.lastSelectedCell);
          this.selectedArea.style.border = this.selectedAreaBorder;
        }
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

  // simple method for getting the first selected cell
  getFirstSelectedCell(): CellSelectionItem {
    return this.selectedCells[0];
  }

  // emits the appr. event in order to show the selection on the grid
  updateState() {
    this.selectedCellsChange.emit(this.selectedCells);
    this.selectedCellDatasChange.emit(this.selectedCellDatas);
    this.aggregatesChange.emit(this.aggregates);
  }

  // sets the rect values of a given cell
  setRectValues(cellRect: Rect, target: HTMLElement) {
    cellRect.left = target?.getClientRects().item(0)!.left;
    cellRect.top = target?.getClientRects().item(0)!.top;
    cellRect.width = target?.getClientRects().item(0)!.width;
    cellRect.height = target?.getClientRects().item(0)!.height;
  }

  // positions and resizes the selected area according to the relation of the first and last selected cells
  resizeSelectedArea(lastSelectedCell: CellSelectionItem) {
    const firstSelectedCell = this.getFirstSelectedCell();
    // right down quarter
    if (
      lastSelectedCell.columnKey >= firstSelectedCell.columnKey &&
      firstSelectedCell.itemKey <= lastSelectedCell.itemKey
    ) {
      // set position
      this.selectedArea.style.left = `${this.firstSelectedCellRect.left}px`;
      this.selectedArea.style.top = `${this.firstSelectedCellRect.top - 1}px`;
      // resize
      this.selectedArea.style.width = `${
        this.lastSelectedCellRect.left +
        this.lastSelectedCellRect.width -
        this.firstSelectedCellRect.left -
        1
      }px`;
      this.selectedArea.style.height = `${
        this.lastSelectedCellRect.top +
        this.lastSelectedCellRect.height -
        this.firstSelectedCellRect.top -
        1
      }px`;
    }
    // right up quarter
    if (
      lastSelectedCell.columnKey > firstSelectedCell.columnKey &&
      firstSelectedCell.itemKey > lastSelectedCell.itemKey
    ) {
      // set position
      this.selectedArea.style.left = `${this.firstSelectedCellRect.left}px`;
      this.selectedArea.style.top = `${this.lastSelectedCellRect.top - 1}px`;
      // resize
      this.selectedArea.style.width = `${
        this.lastSelectedCellRect.left +
        this.lastSelectedCellRect.width -
        this.firstSelectedCellRect.left -
        1
      }px`;
      this.selectedArea.style.height = `${
        this.firstSelectedCellRect.top +
        this.firstSelectedCellRect.height -
        this.lastSelectedCellRect.top -
        1
      }px`;
    }
    // left up quarter
    if (
      lastSelectedCell.columnKey <= firstSelectedCell.columnKey &&
      firstSelectedCell.itemKey >= lastSelectedCell.itemKey
    ) {
      // set position
      this.selectedArea.style.left = `${this.lastSelectedCellRect.left}px`;
      this.selectedArea.style.top = `${this.lastSelectedCellRect.top - 1}px`;
      // resize
      this.selectedArea.style.width = `${
        this.firstSelectedCellRect.left +
        this.firstSelectedCellRect.width -
        this.lastSelectedCellRect.left -
        1
      }px`;
      this.selectedArea.style.height = `${
        this.firstSelectedCellRect.top +
        this.firstSelectedCellRect.height -
        this.lastSelectedCellRect.top -
        1
      }px`;
    }
    // left down quarter
    if (
      lastSelectedCell.columnKey < firstSelectedCell.columnKey &&
      firstSelectedCell.itemKey < lastSelectedCell.itemKey
    ) {
      // set position
      this.selectedArea.style.left = `${this.lastSelectedCellRect.left}px`;
      this.selectedArea.style.top = `${this.firstSelectedCellRect.top - 1}px`;
      // resize
      this.selectedArea.style.width = `${
        this.firstSelectedCellRect.left +
        this.firstSelectedCellRect.width -
        this.lastSelectedCellRect.left -
        1
      }px`;
      this.selectedArea.style.height = `${
        this.lastSelectedCellRect.top +
        this.lastSelectedCellRect.height -
        this.firstSelectedCellRect.top -
        1
      }px`;
    }
  }

  // reset the styles of the selected area
  resetSelectedArea() {
    this.selectedArea.style.width = '0px';
    this.selectedArea.style.height = '0px';
    this.selectedArea.style.border = 'none';
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
