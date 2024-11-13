import { CalculatedRow } from '../interfaces/calculated-row.interface';

// calculates the result for a calculated row
export function calculateResultForCalcRow(
  calcRow: CalculatedRow,
  filteredData: any[],
  key: string,
  fieldName: string
): number {
  let result = 0;
  switch (calcRow.calculateFunction) {
    case 'sum':
      result = filteredData.reduce(
        (acc, rowData) =>
          fieldName ? acc + +rowData[key][fieldName] : acc + +rowData[key],
        0
      );
      break;
    case 'avg':
      let countOfNumberValues = 0;
      const sum = filteredData.reduce(
        (acc, rowData) =>
          fieldName ? acc + +rowData[key][fieldName] : acc + +rowData[key],
        0
      );
      if (fieldName) {
        filteredData.map((rowData) => {
          if (isFinite(+rowData[fieldName][key])) countOfNumberValues++;
        });
      } else {
        filteredData.map((rowData) => {
          if (isFinite(+rowData[key])) countOfNumberValues++;
        });
      }
      result = countOfNumberValues > 0 ? sum / countOfNumberValues : 0;
      break;
    case 'min':
      if (fieldName) {
        result = +filteredData.reduce((prev, curr) =>
          +prev[key][fieldName] < +curr[key][fieldName] ? prev : curr
        )[key][fieldName];
      } else {
        result = +filteredData.reduce((prev, curr) =>
          +prev[key] < +curr[key] ? prev : curr
        )[key];
      }
      break;
    case 'max':
      if (fieldName) {
        result = +filteredData.reduce((prev, curr) =>
          +prev[key][fieldName] > +curr[key][fieldName] ? prev : curr
        )[key][fieldName];
      } else {
        result = +filteredData.reduce((prev, curr) =>
          +prev[key] > +curr[key] ? prev : curr
        )[key];
      }
      break;
    case 'count':
      result = filteredData.length;
      break;
    case 'custom':
      const values: any[] = [];
      if (fieldName) {
        // get the corresponding data row from the filtered data and get the column value out of it
        (<string[]>calcRow.calculateByRows).forEach((row) => {
          const calcRowData = filteredData.filter(
            (filtData) => filtData.calcRowName === row
          );
          values.push(calcRowData[0][key][fieldName]);
        });
      } else {
        // get the corresponding data row from the filtered data and get the column value out of it
        (<string[]>calcRow.calculateByRows).forEach((row) => {
          const calcRowData = filteredData.filter(
            (filtData) => filtData.calcRowName === row
          );
          values.push(calcRowData[0][key]);
        });
      }
      result = calcRow.customFunction!(values);
      break;
  }
  return result;
}
