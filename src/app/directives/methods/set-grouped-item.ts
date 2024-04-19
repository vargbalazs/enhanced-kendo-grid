import { GroupedData } from '../interfaces/grouped-data.interface';

// searches for an item based on the given dataRowIndex and replaces it with the item
export function setGroupedItem(
  groupedData: GroupedData[],
  searchIndex: number,
  item: any
) {
  for (let i = 0; i <= groupedData.length - 1; i++) {
    let groupedItems = groupedData[i].items;
    for (let j = 0; j <= groupedItems.length - 1; j++) {
      if (groupedItems[j].dataRowIndex === searchIndex) {
        groupedItems[j] = item;
        break;
      }
    }
  }
}
