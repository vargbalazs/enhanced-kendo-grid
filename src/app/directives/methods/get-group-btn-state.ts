import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// gets a state of a group button
export function getGroupBtnState(
  level: number,
  config: EnhancedGridConfig
): string | undefined {
  return config.groupLevelButtons.find((btn) => btn.level === level)?.state;
}
