import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// disable paging, if editing, enable, when not
export function handlePaging(config: EnhancedGridConfig, toggle: 'on' | 'off') {
  const pager = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    '.k-pager'
  )!;
  if (toggle === 'off') {
    pager.classList.add('disabled');
  } else {
    pager.classList.remove('disabled');
  }
}
