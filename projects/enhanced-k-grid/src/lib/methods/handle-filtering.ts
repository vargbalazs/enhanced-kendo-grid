import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// enables, disables filtering, if editing or not
export function handleFiltering(
  config: EnhancedGridConfig,
  toggle: 'on' | 'off'
) {
  // filter row
  const filterRow = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    '.enhanced.k-grid [kendogridfilterrow]'
  )!;
  if (toggle === 'off') {
    filterRow.classList.add('disabled');
  } else {
    filterRow.classList.remove('disabled');
  }

  // filter inputs
  const filterInputs = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('.enhanced.k-grid [kendofilterinput]');
  filterInputs.forEach((filterInput) => {
    if (toggle === 'off') {
      filterInput.classList.add('disabled');
    } else {
      filterInput.classList.remove('disabled');
    }
  });

  // dropdown operator buttons
  const dropdownOperators = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('.enhanced.k-grid .k-dropdown-operator');
  dropdownOperators.forEach((dropdownOperator) => {
    if (toggle === 'off') {
      dropdownOperator.classList.add('disabled');
    } else {
      dropdownOperator.classList.remove('disabled');
    }
  });
}
