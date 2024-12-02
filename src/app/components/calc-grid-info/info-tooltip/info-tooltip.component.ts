import { Component } from '@angular/core';
import { EnhancedGridToolTipComponent } from 'src/app/directives/enhanced-grid-tooltip.component';

@Component({
  selector: 'info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.css'],
})
export class InfoTooltipComponent extends EnhancedGridToolTipComponent {}
