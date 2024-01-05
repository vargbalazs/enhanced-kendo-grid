import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// if we press any key, but not shift and control, then reset the state
// reset also, if we selected some cells with the mouse previously
export function resetOnKeydown(
  e: KeyboardEvent,
  resetFn: () => void,
  config: EnhancedGridConfig
) {
  if (!e.shiftKey && !e.ctrlKey) {
    resetFn();
  } else {
    if (config.selectingWithMouse && !e.ctrlKey) resetFn();
  }
}
