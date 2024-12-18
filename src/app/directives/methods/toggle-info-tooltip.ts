import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { InfoTooltip } from '../interfaces/info-tooltip.interface';
import { EnhancedGridToolTipComponent } from '../enhanced-grid-tooltip.component';
import * as methods from './index';

// shows the info tooltip
export function toggleInfoTooltip(
  tooltip: InfoTooltip,
  config: EnhancedGridConfig,
  toggle: 'on' | 'off'
) {
  // get the grid content el
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  if (toggle === 'on') {
    // first remove any already visible tooltip - this can be the case if we hovered on a closable tooltip, but
    // didn't close it
    // if we hover on the same info icon, then do nothing
    const infoTooltipToClose = gridContent.querySelector('[infotooltip]')!;
    if (
      infoTooltipToClose &&
      infoTooltipToClose.getAttribute('name') === tooltip.name
    )
      return;
    if (infoTooltipToClose) gridContent.removeChild(infoTooltipToClose);
    // get the corresponding cell and info icon
    const cell = methods.getInfoCell(
      tooltip.columnField,
      tooltip.rowField,
      tooltip.rowValue,
      config
    )!;
    const infoIcon = cell.querySelector('[info-icon]')!;
    const rect = infoIcon.getBoundingClientRect();
    // create the info tooltip element
    const infoTooltip = document.createElement('div');
    infoTooltip.setAttribute('infotooltip', '');
    infoTooltip.setAttribute('name', tooltip.name);
    infoTooltip.classList.add('tooltip', 'common', 'info');
    if (tooltip.width) infoTooltip.style.width = tooltip.width;
    // if we have just a simple string
    if (typeof tooltip.content === 'string') {
      infoTooltip.innerHTML = `
        <div class="content">
            ${tooltip.content}
        </div>
        <i></i>`;
    }
    // if we have a component
    else {
      if (!config.infoTooltipContainer) {
        console.error(
          `In case of a component based info tooltip, the component, which contains the grid with the info tooltips, should have a 'div' element with a template reference variable called 'infoTooltip'.`
        );
        return;
      }
      config.infoTooltipContainer.clear();
      const compRef = config.infoTooltipContainer.createComponent(
        tooltip.content
      );
      (<EnhancedGridToolTipComponent>compRef.instance).fieldValue =
        methods.getCellValuePrivate(
          tooltip.rowField,
          tooltip.rowValue,
          tooltip.columnField,
          config.gridData,
          tooltip.inCalcRow
        );
      (<EnhancedGridToolTipComponent>compRef.instance).gridData =
        config.gridData;
      (<EnhancedGridToolTipComponent>compRef.instance).getCellValue =
        methods.getCellValuePrivate;
      infoTooltip.appendChild(compRef.location.nativeElement);
      infoTooltip.appendChild(document.createElement('i'));
    }
    gridContent.appendChild(infoTooltip);
    // if the tooltip is closable, then add an x icon
    if (tooltip.closable) {
      const closeIcon = document.createElement('div');
      closeIcon.classList.add('close-icon');
      closeIcon.innerHTML = tooltip.closeIcon;
      // close on click
      closeIcon.addEventListener('click', () => {
        const infoTooltip = gridContent.querySelector('[infotooltip]')!;
        gridContent.removeChild(infoTooltip);
        config.isInfoTooltipVisible = false;
      });
      infoTooltip.appendChild(closeIcon);
      config.isInfoTooltipVisible = true;
    }
    // set the position of the tooltip
    // setTimeout is needed, because if we use in the custom tooltip component some variables from the component file, then
    // the auto height value won't be the correct one
    setTimeout(() => {
      methods.setPositionInfoTooltip(config, rect, gridContent, infoTooltip);
    });
  } else {
    // if tooltip is not closable, then remove on mouse out
    if (!tooltip.closable) {
      const infoTooltip = gridContent.querySelector('[infotooltip]')!;
      gridContent.removeChild(infoTooltip);
    }
  }
}
