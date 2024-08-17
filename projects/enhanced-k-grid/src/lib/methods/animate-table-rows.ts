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
  // get the corresponging row count and row indexes
  const rowIndexesCount = config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.name === calcRowName
  )?.rowIndexes?.length;
  const rowIndexes = config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.name === calcRowName
  )?.rowIndexes;
  // calculate the total height of the corresponding rows
  let totalHeight = 0;
  for (let i = dataRowIndex + 1; i <= dataRowIndex + rowIndexesCount!; i++) {
    const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `[ng-reflect-data-row-index='${i}']`
    );
    totalHeight += row!.getBoundingClientRect().height;
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
  let detailRows = null;
  for (let i = 0; i <= rowIndexes!.length - 1; i++) {
    const row = `[kendogridlogicalrow][ng-reflect-data-row-index='${
      rowIndexes![i]
    }'`;
    detailRows = (detailRows || jquery(row)).add(row);
  }
  switch (state) {
    case 'expanded':
      // get the group div
      const expandingGroup = jquery(
        `div[calcrowname=${calcRowName}]:not(.group-indicator)`
      );
      // do the animation
      expandingGroup.slideDown(700);
      // remove the group div and show the detail rows
      setTimeout(() => {
        expandingGroup.remove();
        detailRows!.show();
      }, 700);
      break;
    case 'collapsed':
      // clone the detail rows and wrap the rows in a div with a total width of all the columns and the total height of the corresponding rows
      const collapsingGroup = detailRows!
        .clone()
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
      // insert the cloned detail rows after it
      collapsingGroup.insertAfter(calcRow);
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
