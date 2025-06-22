import { FormGroup } from '@angular/forms';
import {
  CellCloseEvent,
  CreateFormGroupArgs,
  GridComponent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// custom function for the cell close logic
export function cellClose(
  args: CellCloseEvent,
  config: EnhancedGridConfig,
  grid: GridComponent,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup,
  resetFn: () => void
) {
  // if some filters or sorting are active, we have to override the edited row index
  if (grid.filter?.filters || grid.sort!.length > 0) {
    // if the grid is grouped
    if (config.groupedGridData.length > 0) {
      const flattenedData = methods.flattenGroupedData(
        (<GridDataResult>grid.data).data
      );
      config.editedRowIndex = flattenedData.findIndex(
        (item) => item.dataRowIndex === grid.activeCell?.dataItem?.dataRowIndex
      );
    } else {
      const gridData = (<GridDataResult>grid.data).data;
      config.editedRowIndex = gridData.findIndex(
        (item) => item.dataRowIndex === grid.activeCell?.dataItem?.dataRowIndex
      );
    }
  }
  // if cell data is invalid, then put the cell back in edit mode
  // with this, we are preventing to focus out (except if we entered in edit mode with Enter)
  // in case of Enter, the old value gets written back
  if (!(<FormGroup>args.formGroup).valid) {
    // if some filters or sorting are active, we use the 'editedRowIndexFilterOrSort' for putting the cell in edit mode
    if (grid.filter?.filters || grid.sort!.length > 0) {
      args.formGroup = config.originalDataItem;
      grid.editCell(
        config.editedRowIndexFilterOrSort,
        config.editedColIndex,
        cellEditingFormGroupFn(args)
      );
    } else {
      args.formGroup = config.originalDataItem;
      grid.editCell(
        config.editedRowIndex,
        config.editedColIndex,
        cellEditingFormGroupFn(args)
      );
    }
  }
  // if we hit escape, then restore the original value
  if ((<KeyboardEvent>args.originalEvent)?.key === 'Escape') {
    // if some filters or sorting are active
    if (grid.filter?.filters || grid.sort!.length > 0) {
      // gridData will have only the filtered rows, so we have to determine the right edited row index
      // if the grid is grouped
      if (config.groupedGridData.length > 0) {
        methods.setGroupedItem(
          (<GridDataResult>grid.data).data,
          grid.activeCell.dataItem.dataRowIndex,
          config.originalDataItem
        );
      } else {
        const gridData = (<GridDataResult>grid.data).data;
        config.editedRowIndex = gridData.findIndex(
          (item) => item.dataRowIndex === grid.activeCell.dataItem.dataRowIndex
        );
        gridData[config.editedRowIndex] = config.originalDataItem;
      }
    } else {
      // if the grid is grouped
      if (config.groupedGridData.length > 0) {
        methods.setGroupedItem(
          config.groupedGridData,
          config.originalDataItem.dataRowIndex,
          config.originalDataItem
        );
      } else {
        config.gridData[config.editedRowIndex] = config.originalDataItem;
      }
    }
    // we have to restore the original values also in the full grid data
    const index = config.fullGridData.findIndex(
      (item) => item.dataRowIndex === grid.activeCell.dataItem.dataRowIndex
    );
    config.fullGridData[index] = config.originalDataItem;
    config.noFocusingWithArrowKeys = false;
    resetFn();

    // if sorting is allowed and cell is closed (no more editing), then put sorting back
    grid.sortable = config.sortable;
  }
  // enable paging, but only if the data is valid
  if (grid.pageable && (<FormGroup>args.formGroup).valid)
    methods.handlePaging(config, 'on');
  // enable filtering, but only if the data is valid
  if (grid.filterable && (<FormGroup>args.formGroup).valid)
    methods.handleFiltering(config, 'on');
  // setTimeout is needed, because if we have custom function in a calculated column, the calculation over the grid is a little bit slow
  // and so we need to run the calculation async
  setTimeout(() => {
    // recalculate the grid if needed and if the data is valid
    if (
      config.calculatedGrid &&
      config.shouldRecalculate &&
      (<FormGroup>args.formGroup).valid
    ) {
      methods.updateCalculatedColumns(config);
      methods.updateCalculatedRows(config);
      // if we have any custom calculated column, then we update the calc column values once again
      // because it can be, that some of the custom calculated columns are using calculated row values
      // we have also to update the rows once again in order to consider the new column values in the calculated rows
      if (
        config.colCalculation.calculatedColumns.some(
          (calcCol) => calcCol.calculateFunction === 'custom'
        )
      ) {
        methods.updateCalculatedColumns(config);
        methods.updateCalculatedRows(config);
      }
      config.shouldRecalculate = false;
    }
  });
  // reset the form group, if the data is valid
  if ((<FormGroup>args.formGroup).valid) {
    if (
      config.cellValueChangingEventValue?.oldValue !==
      config.cellValueChangingEventValue?.newValue
    ) {
      config.cellValueChangedEvent.emit(config.cellValueChangingEventValue);
      config.cellValueChangingEventValue = undefined;
    }

    config.cellEditingFormGroup = new FormGroup({});
    config.statusChanges$.unsubscribe();
    config.valueChanges$.unsubscribe();
    // hide the error tooltip
    let activeCell = config.gridBody.querySelector(
      `[kendogridlogicalrow][data-kendo-grid-item-index="${grid.activeCell.dataRowIndex}"] [kendogridcell][data-kendo-grid-column-index="${grid.activeCell.colIndex}"]`
    );
    const rect = activeCell!.getBoundingClientRect();
    methods.toggleErrorTooltip(config, rect, 'off');
  }
  // if we have some info tooltips
  if (config.infoTooltips.length > 0)
    setTimeout(() => {
      methods.initInfoIcons(config.infoTooltips, config);
    });
  // if the data in the edited cell is a valid number, then write the number value back in the grid data
  // with this, sorting and filtering will work as expected, because the edited value will be threated as a number
  const dataField = config.columns[config.editedCell.colIndex]?.field;
  // depending, whether the grid is filterable and/or filter or sorting is active, we adjust the row index
  let rowIndex = 0;
  if (grid.filter?.filters || grid.sort!.length > 0)
    rowIndex = config.editedRowIndexFilterOrSort;
  rowIndex = grid.filterable
    ? config.editedCell.rowIndex - 2
    : config.editedCell.rowIndex - 1;
  if (dataField && rowIndex >= 0) {
    if (isValidNumber(config.gridData[rowIndex][dataField]))
      config.gridData[rowIndex][dataField] =
        +config.gridData[rowIndex][dataField];
  }
}

function isValidNumber(value: any): boolean {
  const number = parseFloat(value);
  return !isNaN(number) && isFinite(number);
}
