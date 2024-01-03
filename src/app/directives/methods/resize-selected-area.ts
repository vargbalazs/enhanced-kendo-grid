import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// positions and resizes the selected area according to the relation of the first and last selected cells
export function resizeSelectedArea(config: EnhancedGridConfig) {
  const firstSelectedCell = config.firstSelectedCell;
  const lastSelectedCell = config.lastSelectedCell;
  const firstSelectedCellRect = config.firstSelectedCellRect;
  const lastSelectedCellRect = config.lastSelectedCellRect;
  const selectedArea = config.selectedArea;
  // right down quarter
  if (
    lastSelectedCell.columnKey >= firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey <= lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${firstSelectedCellRect.left}px`;
    selectedArea.style.top = `${firstSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      lastSelectedCellRect.left +
      lastSelectedCellRect.width -
      firstSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      lastSelectedCellRect.top +
      lastSelectedCellRect.height -
      firstSelectedCellRect.top -
      1
    }px`;
  }
  // right up quarter
  if (
    lastSelectedCell.columnKey > firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey > lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${firstSelectedCellRect.left}px`;
    selectedArea.style.top = `${lastSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      lastSelectedCellRect.left +
      lastSelectedCellRect.width -
      firstSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      firstSelectedCellRect.top +
      firstSelectedCellRect.height -
      lastSelectedCellRect.top -
      1
    }px`;
  }
  // left up quarter
  if (
    lastSelectedCell.columnKey <= firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey >= lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${lastSelectedCellRect.left}px`;
    selectedArea.style.top = `${lastSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      firstSelectedCellRect.left +
      firstSelectedCellRect.width -
      lastSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      firstSelectedCellRect.top +
      firstSelectedCellRect.height -
      lastSelectedCellRect.top -
      1
    }px`;
  }
  // left down quarter
  if (
    lastSelectedCell.columnKey < firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey < lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${lastSelectedCellRect.left}px`;
    selectedArea.style.top = `${firstSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      firstSelectedCellRect.left +
      firstSelectedCellRect.width -
      lastSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      lastSelectedCellRect.top +
      lastSelectedCellRect.height -
      firstSelectedCellRect.top -
      1
    }px`;
  }
}
