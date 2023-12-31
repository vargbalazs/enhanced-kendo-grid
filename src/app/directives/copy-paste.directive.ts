import {
  Directive,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  CellSelectionItem,
  GridComponent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { CellData } from '../interfaces/celldata.interface';

@Directive({
  selector: '[copyPaste]',
})
export class CopyPasteDirective implements OnInit {
  @Input() selectedCells: CellSelectionItem[] = [];
  @Input() selectedCellDatas: CellData[] = [];
  @Input() selectedArea!: HTMLDivElement;

  private gridData: any[] = [];

  dataCopied = false;

  constructor(private renderer2: Renderer2, private grid: GridComponent) {}

  ngOnInit(): void {
    this.gridData = (<GridDataResult>this.grid.data).data;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // if we press ctrl+c and there are some selected cells, then copy the data to the clipboard
    if (e.ctrlKey && e.key === 'c' && this.selectedCells.length > 0) {
      this.renderer2.addClass(this.selectedArea, 'dashed-border');
      navigator.clipboard
        .writeText(this.convertDataToClipboard(this.selectedCellDatas))
        .then(() => (this.dataCopied = true));
    }
    // pasting values
    if (e.ctrlKey && e.key === 'v') {
      navigator.clipboard.readText().then((text) => {
        const lines = text.split('\r\n');
        const values: string[][] = [];
        // - 2, because the last element is always empty
        for (let i = 0; i <= lines.length - 2; i++) {
          values.push(lines[i].split('\t'));
        }
        let focusedCell = this.grid.activeCell;
        for (let i = 0; i <= values.length - 1; i++) {
          for (let j = 0; j <= values[i].length - 1; j++) {
            const dataItem = this.gridData[focusedCell.dataRowIndex + i];
            // if we are in the grid
            if (dataItem) {
              this.gridData[focusedCell.dataRowIndex + i][
                Object.keys(dataItem)[focusedCell.colIndex + j]
              ] = values[i][j];
            }
          }
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
