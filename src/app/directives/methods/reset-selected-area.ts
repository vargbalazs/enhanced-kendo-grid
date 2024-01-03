// reset the styles of the selected area
export function resetSelectedArea(selectedArea: HTMLDivElement) {
  selectedArea.style.width = '0px';
  selectedArea.style.height = '0px';
  selectedArea.style.display = 'none';
  selectedArea.classList.remove('dashed-border');
}
