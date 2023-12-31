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
import {
  calculateAggregates,
  markCellsAsSelected,
  resetSelectedArea,
  resizeSelectedArea,
  setRectValues,
} from '../helpers/helpers';

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
  public selectingWithMouse = false;

  constructor(private grid: GridComponent) {}

  ngOnInit(): void {
    // store the border of the selected area and use it later
    this.selectedAreaBorder = getComputedStyle(this.selectedArea).border;
    // reset the selected area
    resetSelectedArea(this.selectedArea);
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
    this.selectingWithMouse = true;
    this.updateState();
    resetSelectedArea(this.selectedArea);
    this.selectedArea.style.display = 'block';
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
      resetSelectedArea(this.selectedArea);
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
        // store the last selected cell and it's position
        this.lastSelectedCell = {
          itemKey: dataRowIndex,
          columnKey: columnIndex,
        };
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
          // update only, if we are in another cell
          if (this.selectedCells.length >= 1) this.updateState();
          this.rowIndex = dataRowIndex;
          this.colIndex = columnIndex;
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
  }

  // emits the appr. event in order to show the selection on the grid
  updateState() {
    this.selectedCellsChange.emit(this.selectedCells);
    this.selectedCellDatasChange.emit(this.selectedCellDatas);
    this.aggregatesChange.emit(this.aggregates);
  }
}
