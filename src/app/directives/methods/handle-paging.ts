import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// add mousedown eventlistener to the paging section, because if paging is enabled and if we are editing, we have to prevent paging
export function handlePaging(config: EnhancedGridConfig, grid: GridComponent) {}
