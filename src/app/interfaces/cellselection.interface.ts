import { CellSelectionItem } from '@progress/kendo-angular-grid';
import { CellData } from './celldata.interface';

export interface CellSelection {
  selectedCells: CellSelectionItem[];
  selectedCellDatas: CellData[];
}
