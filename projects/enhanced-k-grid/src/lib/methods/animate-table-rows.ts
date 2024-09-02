import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import jquery from 'jquery';

// animates the other table rows, if one calculated row was expanded or collapsed
export function animateTableRows(
  config: EnhancedGridConfig,
  calcRowName: string,
  state: 'expanded' | 'collapsed',
  renderer2: Renderer2
) {
  // get the dataRowIndex of the calculated row
  const calcRow = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    `[kendogridlogicalrow].${calcRowName}`
  );
  const dataRowIndex = +calcRow!.getAttribute('ng-reflect-data-row-index')!;
  // get the corresponging calc row and some properties of it
  const row = config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.name === calcRowName
  );
  const rowIndexesCount = row?.rowIndexes?.length;
  const rowIndexes = row?.rowIndexes;
  // determine the row align (we can't use the existing property, because this isn't always present, f. e.
  // if we declare a calc row with its position)
  const rowAlign = dataRowIndex < rowIndexes![0] ? 'top' : 'bottom';
  // calculate the total height of the corresponding rows
  // for hidden rows the height is obviously 0, that's why we don't need to handle the special case of multiple levels
  let totalHeight = 0;
  if (rowAlign === 'top') {
    for (let i = dataRowIndex + 1; i <= dataRowIndex + rowIndexesCount!; i++) {
      const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `[ng-reflect-data-row-index='${i}']`
      );
      totalHeight += row!.getBoundingClientRect().height;
    }
  } else {
    for (let i = dataRowIndex - rowIndexesCount!; i <= dataRowIndex - 1; i++) {
      const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `[ng-reflect-data-row-index='${i}']`
      );
      totalHeight += row!.getBoundingClientRect().height;
    }
  }
  // caclulate the total widht of the columns
  let totalWidth = 0;
  config.columns.forEach((col) => {
    totalWidth += col.width;
  });
  // before expanding/collapsing scroll the grid back
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  gridContent?.scrollBy({
    left: -gridContent.scrollLeft,
    //behavior: 'smooth',
  });
  // handle the state change
  // first get the detail rows
  // if any of the rows has the 'collapsed' attribute, this means, that previously we already collapsed at least one group - in this case we should collect the html elements differently
  let alreadyCollapsed = false;
  let detailRows = null;
  for (let i = 0; i <= rowIndexes!.length - 1; i++) {
    const row = `[kendogridlogicalrow][ng-reflect-data-row-index='${
      rowIndexes![i]
    }']`;
    if (!alreadyCollapsed)
      alreadyCollapsed = (<HTMLElement>config.gridElRef.nativeElement)
        .querySelector(
          `[kendogridlogicalrow][ng-reflect-data-row-index='${rowIndexes![i]}']`
        )
        ?.hasAttribute('collapsed')!;
    detailRows = (detailRows || jquery(row)).add(row);
  }
  // collect the elements differently, but only if we want to expand the group row
  if (alreadyCollapsed && state === 'collapsed') {
    const startRow = (<HTMLElement>(
      config.gridElRef.nativeElement
    )).querySelector(
      `[kendogridlogicalrow][ng-reflect-data-row-index='${rowIndexes![0]}']`
    )!;
    let stopRow = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `[kendogridlogicalrow][ng-reflect-data-row-index='${rowIndexes!.at(-1)}']`
    )!;
    // if the 'stopRow' has the attr. 'collapsed', it means, that this isn't the last row, because there is also the hidden row with the same index, and we need this
    if (stopRow.hasAttribute('collapsed')) {
      stopRow = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
        `[kendogridlogicalrow][ng-reflect-data-row-index='${rowIndexes!.at(
          -1
        )}']:not([collapsed])`
      )!;
    }
    const range = jquery(startRow).nextUntil(stopRow).addBack().add(stopRow);
    detailRows = range;
  }
  switch (state) {
    case 'expanded':
      // get the group div
      const expandingGroup = jquery(
        `div[calcrowname=${calcRowName}]:not(.group-indicator)`
      );
      // do the animation
      expandingGroup.slideDown(2700);
      // remove the group div and show the detail rows
      setTimeout(() => {
        // if we expand a group row, which has at least one collapsed group, then do it differently
        // otherwise just remove the group div and simply show the detail rows
        const div = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
          `div[calcrowname=${calcRowName}]:not(.group-indicator)`
        );
        if (alreadyCollapsed) {
          // remove only the wrapper div element, but keep the inner elements
          const startRow = (<HTMLElement>(
            config.gridElRef.nativeElement
          )).querySelector(
            `[kendogridlogicalrow][ng-reflect-data-row-index='${
              rowIndexes![0]
            }']`
          )!;
          jquery(startRow).unwrap();
          alreadyCollapsed = false;
        } else {
          expandingGroup.remove();
          detailRows!.show();
        }
      }, 2700);
      break;
    case 'collapsed':
      // clone the detail rows and wrap the rows in a div with a total width of all the columns and the total height of the corresponding rows
      const collapsingGroup = detailRows!
        .clone()
        .attr('collapsed', '')
        .animate({ paddingTop: 0, paddingBottom: 0 }, 500)
        .wrapAll(`<div style='pointer-events: none' />`)
        .parent()
        .height(totalHeight)
        .width(totalWidth)
        .attr('calcrowname', calcRowName);
      // hide the detail rows
      detailRows!.hide();
      // get the calcrow element
      const calcRow = jquery(`[kendogridlogicalrow].${calcRowName}`);
      // insert the cloned detail rows before or after it, depending on the align property
      if (rowAlign === 'top') {
        collapsingGroup.insertAfter(calcRow);
      } else {
        // if we have bottom group rows, then we have to insert the div before the first child row
        // with this we assure, that selecting with the keyboard works proper
        // get the first child row
        const firstChildRow = `[kendogridlogicalrow][ng-reflect-data-row-index='${
          rowIndexes![0]
        }']`;
        // insert before this first child row
        collapsingGroup.insertBefore(firstChildRow);
      }
      // because a table shouldn't contain a div, this messes up the layout, so we have to set back the original
      // width of the columns (without padding and border)
      for (let i = 0; i <= config.columnWidths.length - 1; i++) {
        jquery(
          `div[calcrowname=${calcRowName}] td[ng-reflect-col-index=${i}]`
        ).width(config.columnWidths[i]);
      }
      // do the animation
      collapsingGroup.slideUp(700);
      break;
  }
}
