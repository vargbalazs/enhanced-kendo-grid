import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// check the frozen columns and add the appr. styling to the frozen columns
export function handleFrozenColumns(config: EnhancedGridConfig) {
  // sort the frozen columns
  config.frozenColumns.sort(
    (col1, col2) => col1.columnIndex! - col2.columnIndex!
  );
  // if the index of the first element isn't 0, then error
  if (config.frozenColumns[0].columnIndex !== 0) {
    console.error('Frozen columns should start from the first column!');
    return;
  }
  // there should be no gap between the elements (if we have at least 2)
  let noGap = true;
  if (config.frozenColumns.length > 1) {
    for (let i = 1; i <= config.frozenColumns.length - 1; i++) {
      if (
        config.frozenColumns[i].columnIndex! -
          config.frozenColumns[i - 1].columnIndex! >
        1
      ) {
        noGap = false;
        break;
      }
    }
  }
  if (!noGap) {
    console.error('The frozen columns should follow each other with no gaps!');
    return;
  }

  let cumColWidth = 0;
  let groupColWidth = 0;

  // get the grid content
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // if the grid is grouped, then freeze the first column, which is showing the arrows
  if (config.groupedGridData.length > 0) {
    const groupCells = <NodeList>gridContent.querySelectorAll('.k-group-cell');
    groupCells.forEach((node) => {
      (<HTMLElement>node).style.position = 'sticky';
      (<HTMLElement>node).style.zIndex = '2';
      (<HTMLElement>node).style.left = `0px`;
    });
    // adjust the cumColWidth
    groupColWidth = (<HTMLElement>groupCells.item(0)).getBoundingClientRect()
      .width;
    cumColWidth += groupColWidth;
    // freeze also the first cells in the header
    const headerCells = (<HTMLElement>(
      config.gridElRef.nativeElement
    )).querySelectorAll('[kendogridheader] .k-group-cell');
    headerCells.forEach((node) => {
      (<HTMLElement>node).style.position = 'sticky';
      (<HTMLElement>node).style.zIndex = '2';
      (<HTMLElement>node).style.left = `0px`;
    });
  }
  // set the styles to the frozen columns
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    // headers
    config.columns[config.frozenColumns[i].columnIndex!].headerStyle = {
      position: 'sticky',
      'z-index': '2',
      left: `${cumColWidth}px`,
      'background-color': '#fafafa',
    };
    // filter row
    config.columns[config.frozenColumns[i].columnIndex!].filterStyle = {
      position: 'sticky',
      'z-index': '2',
      left: `${cumColWidth}px`,
    };
    // cells
    config.columns[config.frozenColumns[i].columnIndex!].style = {
      position: 'sticky',
      'z-index': '2',
      left: `${cumColWidth}px`,
    };
    // cells of a grouped row
    let groupCells = <NodeList>(
      gridContent.querySelectorAll(
        `[ng-reflect-group-item][ng-reflect-logical-col-index="${config
          .frozenColumns[i].columnIndex!}"]`
      )
    );
    groupCells.forEach((node) => {
      (<HTMLElement>node).style.position = 'sticky';
      (<HTMLElement>node).style.zIndex = '2';
      // cumColWidth has to be adjusted with the groupColWidth, but only for the cells in the first column
      (<HTMLElement>node).style.left =
        i === 0 ? `${cumColWidth - groupColWidth}px` : `${cumColWidth}px`;
    });
    // for the last column we draw a separator
    if (i === config.frozenColumns.length - 1) {
      // headers
      config.columns[config.frozenColumns[i].columnIndex!].headerStyle = {
        ...config.columns[config.frozenColumns[i].columnIndex!].headerStyle,
        'border-right': '1px solid lightgray',
      };
      // filter row
      config.columns[config.frozenColumns[i].columnIndex!].filterStyle = {
        ...config.columns[config.frozenColumns[i].columnIndex!].filterStyle,
        'border-right': '1px solid lightgray',
      };
      // cells
      config.columns[config.frozenColumns[i].columnIndex!].style = {
        ...config.columns[config.frozenColumns[i].columnIndex!].style,
        'border-right': '1px solid lightgray',
      };
      // if it is a grouped grid
      if (config.groupedGridData.length > 0) {
        let groupCells = <NodeList>(
          gridContent.querySelectorAll(
            `[ng-reflect-group-item][ng-reflect-logical-col-index="${config
              .frozenColumns[i].columnIndex!}"]`
          )
        );
        groupCells.forEach((node) => {
          (<HTMLElement>node).style.borderRight = '1px solid lightgray';
        });
      }
    }
    // cumulate the width
    cumColWidth += config.columns[config.frozenColumns[i].columnIndex!].width;
  }
}
