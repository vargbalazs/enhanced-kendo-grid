import { Component, OnInit } from '@angular/core';
import { EnhancedGridToolTipComponent } from 'src/app/directives/enhanced-grid-tooltip.component';

@Component({
  selector: 'info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.css'],
})
export class InfoTooltipComponent
  extends EnhancedGridToolTipComponent
  implements OnInit
{
  ngOnInit(): void {
    //console.log(this.gridData);
    const val = this.getCellValue(
      'category',
      'cat 2',
      'feb',
      this.gridData,
      false
    );
    console.log(val);
    const val2 = this.getCellValue(
      'id',
      'cat 1 sum',
      'feb',
      this.gridData,
      true
    );
    console.log(val2);
  }
}
