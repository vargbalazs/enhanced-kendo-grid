import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

export function groupLevelBtnClick(target: any, config: EnhancedGridConfig) {
  // get the target as a button and get the level
  const btn = <HTMLButtonElement>target;
  const level = +btn.getAttribute('level')!;
  // get the group indicators until this level and perform a click action
  for (let i = 3; i >= level; i--) {
    const indicators = (<HTMLElement>(
      config.gridElRef.nativeElement
    )).querySelectorAll(`.group-indicator[level="${i}"]`);
    indicators.forEach((indicator) => {
      (<HTMLElement>indicator).click();
    });
  }
}
