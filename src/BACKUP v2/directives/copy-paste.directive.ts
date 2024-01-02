import {
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
import { CellData } from '../interfaces/celldata.interface';
import { Rect } from '../interfaces/rect.interface';
import { resizeSelectedArea, setRectValues } from '../helpers/helpers';
import { SelectingWithMouseDirective } from './selecting-with-mouse.directive';

@Directive({
  selector: '[copyPaste]',
})
export class CopyPasteDirective implements OnInit {
  @Input() selectedCells: CellSelectionItem[] = [];
  @Input() selectedCellDatas: CellData[] = [];
  @Input() selectedArea!: HTMLDivElement;

  @Output() selectedCellsChange = new EventEmitter<CellSelectionItem[]>();
  @Output() selectedCellDatasChange = new EventEmitter<CellData[]>();

  private gridData: any[] = [];
  private firstSelectedCellRect: Rect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  private lastSelectedCellRect: Rect = { left: 0, top: 0, width: 0, height: 0 };

  dataCopied = false;
  startingCell: any;

  constructor(
    private renderer2: Renderer2,
    private grid: GridComponent,
    private selectingWithMouseDir: SelectingWithMouseDirective
  ) {}

  ngOnInit(): void {
    this.gridData = (<GridDataResult>this.grid.data).data;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // if we press ctrl+c and there are some selected cells, then copy the data to the clipboard
    if (e.ctrlKey && e.key === 'c') {
      this.startingCell = <HTMLElement>e.target;
      this.renderer2.addClass(this.startingCell, 'no-focus-shadow');
      // if multiple cells were selected
      if (this.selectedCells.length > 0) {
        this.renderer2.addClass(this.selectedArea, 'dashed-border');
        navigator.clipboard
          .writeText(this.convertDataToClipboard(this.selectedCellDatas))
          .then(() => (this.dataCopied = true));
      } else {
        this.dataCopied = true;
        setRectValues(this.firstSelectedCellRect, <HTMLElement>e.target);
        setRectValues(this.lastSelectedCellRect, <HTMLElement>e.target);
        resizeSelectedArea(
          {
            itemKey: this.grid.activeCell.dataRowIndex,
            columnKey: this.grid.activeCell.colIndex,
          },
          [
            {
              itemKey: this.grid.activeCell.dataRowIndex,
              columnKey: this.grid.activeCell.colIndex,
            },
          ],
          this.selectedArea,
          this.firstSelectedCellRect,
          this.lastSelectedCellRect
        );
        this.selectedArea.style.border =
          this.selectingWithMouseDir.selectedAreaBorder;
        this.renderer2.addClass(this.selectedArea, 'dashed-border');
      }
    }
    // pasting values
    if (e.ctrlKey && e.key === 'v') {
      navigator.clipboard.readText().then((text) => {
        if (text) {
          const lines = text.split('\r\n');
          const values: string[][] = [];
          // - 2, because the last element is always empty
          for (let i = 0; i <= lines.length - 2; i++) {
            values.push(lines[i].split('\t'));
          }
          const columnCount = values[0].length;
          // get the total column count
          const totalColumnCount = (<ColumnComponent[]>(
            this.grid.columnList.toArray()
          )).filter((c) => !c.hidden).length;
          const columns = (<ColumnComponent[]>(
            this.grid.columnList.toArray()
          )).filter((c) => !c.hidden);
          let focusedCell = this.grid.activeCell;
          for (let i = 0; i <= columnCount - 1; i++) {
            for (let j = 0; j <= values.length - 1; j++) {
              const dataItem = this.gridData[focusedCell.dataRowIndex + j];
              // if we are in the grid
              if (
                dataItem &&
                focusedCell.colIndex + i <= totalColumnCount - 1
              ) {
                // write the values into the grid
                const field = Object.keys(dataItem)[focusedCell.colIndex + i];
                // if the field is an object, we have to modify the appr. property
                if (typeof dataItem[field] == 'object') {
                  const columnField = columns[focusedCell.colIndex + i].field;
                  const property = columnField.substring(
                    columnField.indexOf('.') + 1
                  );
                  this.gridData[focusedCell.dataRowIndex + j][
                    Object.keys(dataItem)[focusedCell.colIndex + i]
                  ][property] = values[j][i];
                } else {
                  this.gridData[focusedCell.dataRowIndex + j][
                    Object.keys(dataItem)[focusedCell.colIndex + i]
                  ] = values[j][i];
                }
                // mark the cells as selected and store it's values
                this.selectedCells = [
                  ...this.selectedCells,
                  {
                    itemKey: focusedCell.dataRowIndex + j,
                    columnKey: focusedCell.colIndex + i,
                  },
                ];
                this.selectedCellDatas = [
                  ...this.selectedCellDatas,
                  { value: values[j][i] },
                ];
              }
            }
          }
          // update the grid
          this.selectedCellsChange.emit(this.selectedCells);
          this.selectedCellDatasChange.emit(this.selectedCellDatas);
          // draw the border for the selected area
          // sets the first and last cell rect values
          let target = <HTMLElement>e.target;
          const gridBody = target.parentElement?.parentElement;
          setRectValues(this.firstSelectedCellRect, target);
          target = gridBody!.querySelector(
            `[ng-reflect-data-row-index="${
              this.selectedCells[this.selectedCells.length - 1].itemKey
            }"][ng-reflect-col-index="${
              this.selectedCells[this.selectedCells.length - 1].columnKey
            }"]`
          )!;
          setRectValues(this.lastSelectedCellRect, target);
          // draw the area
          resizeSelectedArea(
            {
              itemKey: this.grid.activeCell.dataRowIndex + values.length - 1,
              columnKey: this.grid.activeCell.colIndex + columnCount - 1,
            },
            this.selectedCells,
            this.selectedArea,
            this.firstSelectedCellRect,
            this.lastSelectedCellRect
          );
          this.selectedArea.style.border =
            this.selectingWithMouseDir.selectedAreaBorder;
        }
      });
    }
  }

  convertDataToClipboard(selectedCellDatas: CellData[]): string {
    let firstCell = this.selectedCells[0];
    let lastCell = this.selectedCells[this.selectedCells.length - 1];
    let data = '<table>';
    let columnOffset =
      Math.abs(
        this.selectedCells[this.selectedCells.length - 1].columnKey -
          this.selectedCells[0].columnKey
      ) + 1;
    let rowOffset =
      Math.abs(
        this.selectedCells[this.selectedCells.length - 1].itemKey -
          this.selectedCells[0].itemKey
      ) + 1;

    // right and down
    if (
      firstCell.itemKey <= lastCell.itemKey &&
      firstCell.columnKey <= lastCell.columnKey
    ) {
      for (let i = 0; i <= rowOffset - 1; i++) {
        data = data.concat('<tr>');
        for (let j = 0; j <= columnOffset - 1; j++) {
          data = data.concat(
            '<td>',
            selectedCellDatas[i + rowOffset * j].value.toString(),
            '</td>'
          );
        }
        data = data.concat('</tr>');
      }
    }

    // right and up
    if (
      firstCell.itemKey > lastCell.itemKey &&
      firstCell.columnKey <= lastCell.columnKey
    ) {
      for (let i = rowOffset - 1; i >= 0; i--) {
        data = data.concat('<tr>');
        for (let j = 0; j <= columnOffset - 1; j++) {
          data = data.concat(
            '<td>',
            selectedCellDatas[i + rowOffset * j].value.toString(),
            '</td>'
          );
        }
        data = data.concat('</tr>');
      }
    }

    //left and up
    if (
      firstCell.itemKey >= lastCell.itemKey &&
      firstCell.columnKey > lastCell.columnKey
    ) {
      for (let i = rowOffset - 1; i >= 0; i--) {
        data = data.concat('<tr>');
        for (let j = columnOffset - 1; j >= 0; j--) {
          data = data.concat(
            '<td>',
            selectedCellDatas[i + rowOffset * j].value.toString(),
            '</td>'
          );
        }
        data = data.concat('</tr>');
      }
    }

    //left and down
    if (
      firstCell.itemKey < lastCell.itemKey &&
      firstCell.columnKey > lastCell.columnKey
    ) {
      for (let i = 0; i <= rowOffset - 1; i++) {
        data = data.concat('<tr>');
        for (let j = columnOffset - 1; j >= 0; j--) {
          data = data.concat(
            '<td>',
            selectedCellDatas[i + rowOffset * j].value.toString(),
            '</td>'
          );
        }
        data = data.concat('</tr>');
      }
    }

    data = data + '</table>';
    return data;
  }
}
