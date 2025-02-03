import { EventEmitter, Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';
import { GridComponent } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';

// copies the selected data to the clipboard
export function copyDataToClipboard(
  e: KeyboardEvent,
  config: EnhancedGridConfig,
  renderer2: Renderer2,
  grid: GridComponent,
  updateFn: () => void,
  intlService: IntlService,
  dataCopiedEvent: EventEmitter<string>
) {
  // if we press ctrl+c and there are some selected cells, then copy the data to the clipboard
  if (e.ctrlKey && e.key === 'c') {
    // remove the focus shadow from the selected cell
    config.firstSelectedCellElement = <HTMLElement>e.target;
    renderer2.addClass(config.firstSelectedCellElement, 'no-focus-shadow');

    // if multiple cells were selected
    if (config.selectedCells.length > 1) {
      // adding dashed border and remove shadow
      renderer2.addClass(config.selectedArea.firstChild, 'dashed-border');
      renderer2.setStyle(config.selectedArea, 'boxShadow', 'none');
      // copy content to clipboard
      methods.prepareDataForClipboard(config);
      navigator.clipboard.writeText(config.copiedDataToClipboard).then(() => {
        config.dataCopied = true;
        // emit an event with the copied values in it
        dataCopiedEvent.emit(config.copiedDataToClipboard);
      });
    } else {
      // if just only one cell is copied
      // set the variables for resizing the selected area
      methods.setRectValues(
        config.firstSelectedCellRect,
        <HTMLElement>e.target,
        config
      );
      methods.setRectValues(
        config.lastSelectedCellRect,
        <HTMLElement>e.target,
        config
      );
      config.firstSelectedCell = {
        itemKey: grid.activeCell.dataRowIndex,
        columnKey: grid.activeCell.colIndex,
      };
      config.lastSelectedCell = {
        itemKey: grid.activeCell.dataRowIndex,
        columnKey: grid.activeCell.colIndex,
      };
      // resize the selected area and adjust style, but only if we aren't in edit mode
      if (!grid.isEditing()) {
        methods.resizeSelectedArea(config);
        config.selectedArea.style.border = config.selectedAreaBorder;
        renderer2.addClass(config.selectedArea.firstChild, 'dashed-border');
        renderer2.setStyle(config.selectedArea, 'boxShadow', 'none');
      }
      // get the data
      let fieldname = config.columns[grid.activeCell.colIndex].field;
      let value: string | number;
      // if the field is an object
      if (fieldname.includes('.')) {
        const objectKey = fieldname.substring(0, fieldname.indexOf('.'));
        const propertyKey = fieldname.substring(fieldname.indexOf('.') + 1);
        value =
          config.gridData[
            grid.activeCell.dataRowIndex - (grid.skip ? grid.skip : 0)
          ][objectKey][propertyKey];
      } else {
        value =
          config.gridData[
            grid.activeCell.dataRowIndex - (grid.skip ? grid.skip : 0)
          ][fieldname];
      }
      // don't consider values from cells in case of calcualted rows, which aren't calculated fields (which are 'hidden')
      if (
        config.gridData[
          grid.activeCell.dataRowIndex - (grid.skip ? grid.skip : 0)
        ].calculated &&
        !config.rowCalculation.calculatedFields.includes(fieldname) &&
        config.rowCalculation.titleField !== fieldname
      ) {
        value = '';
      }
      // don't consider also values in an empty row
      if (
        config.gridData[
          grid.activeCell.dataRowIndex - (grid.skip ? grid.skip : 0)
        ].calculated &&
        config.gridData[
          grid.activeCell.dataRowIndex - (grid.skip ? grid.skip : 0)
        ].empty
      ) {
        value = '';
      }
      // check if the value is a date and format it according to the defined format in the column definition
      // if no format is defined, then use a default
      if (<any>value instanceof Date) {
        const format = config.columns[grid.activeCell.colIndex].format;
        value = intlService.formatDate(
          new Date(value),
          !format ? 'yyyy.MM.dd' : format
        );
      }
      config.selectedCellDatas = [
        {
          value: value,
        },
      ];
      // select the cell and update the state
      config.selectedCells = [
        {
          itemKey: grid.activeCell.dataRowIndex,
          columnKey: grid.activeCell.colIndex,
        },
      ];
      methods.calculateAggregates(config);
      updateFn();
      // copy the data
      navigator.clipboard
        .writeText(config.selectedCellDatas[0].value.toString())
        .then(() => {
          config.dataCopied = true;
          // emit an event with the copied values in it
          dataCopiedEvent.emit(config.selectedCellDatas[0].value.toString());
        });
    }
  }
}
