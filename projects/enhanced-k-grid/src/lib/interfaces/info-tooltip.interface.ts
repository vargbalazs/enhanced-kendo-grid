import { Type } from '@angular/core';

export interface InfoTooltip {
  name: string;
  columnField: string;
  rowField: string;
  rowValue: any;
  icon: any;
  content: Type<unknown> | string;
  closable: boolean;
  closeIcon?: any;
  width?: string;
}
