// some checking functions
export function isGroupCell(target: any) {
  return (<HTMLElement>target).parentElement?.hasAttribute(
    'kendogridgroupheader'
  );
}

export function isFilterCell(target: any) {
  return (<HTMLElement>target).hasAttribute('kendogridfiltercell');
}

export function isHeaderCell(target: any) {
  return (<HTMLElement>target).role === 'columnheader';
}
