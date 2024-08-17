import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

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
  // get the corresponging row counts
  const rowIndexesCount = config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.name === calcRowName
  )?.rowIndexes?.length;
  // calculate the total height of the corresponding rows
  let totalHeight = 0;
  for (let i = dataRowIndex + 1; i <= rowIndexesCount!; i++) {
    const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `[ng-reflect-data-row-index='${i}']`
    );
    totalHeight += row!.getBoundingClientRect().height;
  }
  // handle the state change
  switch (state) {
    case 'expanded':
      $(`[kendogridlogicalrow][calcrowname=${calcRowName}] td`)
        .animate({ padding: 0 })
        .wrapInner('<div />')
        .children()
        .slideDown(function () {
          $(this).closest('tr').show();
        });
      break;
    case 'collapsed':
      // $(`[kendogridlogicalrow][calcrowname=${calcRowName}]`)
      //   .animate({ paddingTop: 0, paddingBottom: 0 }, 500)
      //   .wrapInner('<div />')
      //   .children()
      //   .slideUp(500, function () {
      //     $(this).closest('tr').hide();
      //   });

      // wrap the corresponding rows in a div with a width of 100vw and the total height of the corresponding rows
      const rows = $(`[kendogridlogicalrow][calcrowname=${calcRowName}]`)
        .animate({ paddingTop: 0, paddingBottom: 0 }, 500)
        .wrapAll(`<div class='inner' />`)
        .parent()
        .height(totalHeight);

      // because a table shouldn't contain a div, this messes up the layout, so we have to set the original
      // width of the columns back
      // for (let i = 0; i <= config.columnWidths.length - 1; i++) {
      //   $(`.inner td[ng-reflect-col-index=${i}]`).width(config.columnWidths[i]);
      // }

      $(`.inner td[ng-reflect-col-index=${0}]`).width(16);
      $(`.inner td[ng-reflect-col-index=${1}]`).width(95.2);
      $(`.inner td[ng-reflect-col-index=${2}]`).width(115.2);
      $(`.inner td[ng-reflect-col-index=${3}]`).width(115.2);
      $(`.inner td[ng-reflect-col-index=${4}]`).width(115.2);
      $(`.inner td[ng-reflect-col-index=${5}]`).width(114.4);
      $(`.inner td[ng-reflect-col-index=${6}]`).width(95.2);
      $(`.inner td[ng-reflect-col-index=${7}]`).width(95.2);
      $(`.inner td[ng-reflect-col-index=${8}]`).width(95.2);
      $(`.inner td[ng-reflect-col-index=${9}]`).width(95.2);
      $(`.inner td[ng-reflect-col-index=${10}]`).width(95.2);
      $(`.inner td[ng-reflect-col-index=${11}]`).width(95.2);
      $(`.inner td[ng-reflect-col-index=${12}]`).width(95.2);
      // $(`.inner td[ng-reflect-col-index=${13}]`).width(95.2);
      // $(`.inner td[ng-reflect-col-index=${14}]`).width(95.2);
      // $(`.inner td[ng-reflect-col-index=${15}]`).width(95.2);
      // $(`.inner td[ng-reflect-col-index=${16}]`).width(95.2);
      // $(`.inner td[ng-reflect-col-index=${17}]`).width(95.2);
      // $(`.inner td[ng-reflect-col-index=${18}]`).width(95.2);
      // $(`.inner td[ng-reflect-col-index=${19}]`).width(95.2);

      rows.slideUp(5000);

      break;
  }
}
