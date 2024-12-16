export abstract class EnhancedGridToolTipComponent {
  gridData: any;
  fieldValue: any;
  getCellValue!: (
    rowField: string,
    rowValue: any,
    columnField: string,
    gridData: any[],
    inCalcRow: boolean
  ) => any;
}
