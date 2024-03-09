import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// set the styles for the calc rows
export function styleCalculatedRows(
  config: EnhancedGridConfig,
  customCssClasses: string[]
) {
  for (let i = 0; i <= config.columns.length - 1; i++) {
    // get the existing cssClass property of the column
    const colCssClass = config.columns[i].cssClass;
    // add the existing css class or classes to an array
    const cssClasses: string[] = [];
    // set the style of the unused fields
    if (
      config.columns[i].field !== config.rowCalculation.titleField &&
      !config.rowCalculation.calculatedFields.includes(config.columns[i].field)
    ) {
      // if there is only one css class
      if (colCssClass && typeof colCssClass === 'string')
        cssClasses.push(colCssClass);
      // if there are multiple css classes
      if (colCssClass && Array.isArray(colCssClass))
        cssClasses.push(...colCssClass);
      // add the custom class
      cssClasses.push('hide-value', ...customCssClasses);
    } else {
      // if there is only one css class
      if (colCssClass && typeof colCssClass === 'string')
        cssClasses.push(colCssClass);
      // if there are multiple css classes
      if (colCssClass && Array.isArray(colCssClass))
        cssClasses.push(...colCssClass);
      // add the custom class
      cssClasses.push(...customCssClasses);
    }
    // overwrite the cssClass property with the new array
    config.columns[i].cssClass = cssClasses;
    config.columnStyles.push({ cssClasses: cssClasses, columnIndex: i });
  }
}
