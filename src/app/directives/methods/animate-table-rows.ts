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
  // const dataRowIndex = +calcRow!.getAttribute('ng-reflect-data-row-index')!;
  // // calculate the index, from wich we want to slide up/slide down the table rows
  // const rowIndexesCount = config.rowCalculation.calculatedRows.find(
  //   (calcRow) => calcRow.name === calcRowName
  // )?.rowIndexes?.length;
  // const fromRowIndex = dataRowIndex + rowIndexesCount! + 1;
  // // calculate the y value for translateY (theoretically it is always the same, but who knows)
  // let totalHeight = 0;
  // for (let i = dataRowIndex + 1; i <= rowIndexesCount!; i++) {
  //   const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
  //     `[ng-reflect-data-row-index='${i}']`
  //   );
  //   totalHeight += row!.getBoundingClientRect().height;
  // }
  // // query for all rows below this index (inclusive)
  // for (let i = fromRowIndex; i <= config.gridData.length - 1; i++) {
  //   const row = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
  //     `[ng-reflect-data-row-index='${i}']`
  //   );
  //   // slide up or down the rows
  //   switch (state) {
  //     case 'expanded':
  //       renderer2.setStyle(row, 'transform', 'translateY(0px)', 2);
  //       break;
  //     case 'collapsed':
  //       renderer2.setStyle(
  //         row,
  //         'transform',
  //         `translateY(-${totalHeight}px)`,
  //         2
  //       );
  //       break;
  //   }
  // }
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

      const rows = $(`[kendogridlogicalrow][calcrowname=${calcRowName}]`)
        .animate({ paddingTop: 0, paddingBottom: 0 }, 500)
        .wrapAll(`<div />`)
        .parent()
        .height('208px');

      // rows.each(function (i, row) {
      //   console.log(row);
      // });

      rows.slideUp(500);

      // rows.slideUp(500, function () {
      //   $(this).closest('tr').hide();
      // });

      // $(rows.get().reverse()).each(function (i, row) {
      //   $(this)
      //     .delay(100)
      //     .slideUp(500, function () {
      //       $(this).closest('tr').hide();
      //     });
      // });

      break;
  }
}
