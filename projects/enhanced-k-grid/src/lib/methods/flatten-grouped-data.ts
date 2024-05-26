// flattes the grouped grid data
export function flattenGroupedData(data: any[]): any[] {
  let temp: any[] = [];
  for (let i = 0; i <= data.length - 1; i++) {
    temp.push(...data[i].items);
  }
  return temp;
}
