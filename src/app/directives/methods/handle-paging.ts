import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// disable paging, if editing, enable, when not
export function handlePaging(config: EnhancedGridConfig, toggle: 'on' | 'off') {
  const pager = (<HTMLElement>config.gridElRef.nativeElement).querySelectorAll(
    '.k-pager'
  );
  if (toggle === 'off') {
    pager.item(0).classList.add('disabled');
  } else {
    pager.item(0).classList.remove('disabled');
  }
}
