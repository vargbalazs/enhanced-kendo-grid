import {
  AfterViewInit,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  CellSelectionItem,
  ColumnComponent,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { SelectingWithMouseDirective } from './selecting-with-mouse.directive';
import { CellData } from '../interfaces/celldata.interface';
import { Aggregate } from '../interfaces/aggregate.interface';
import { Rect } from '../interfaces/rect.interface';
import { resetSelectedArea } from '../helpers/helpers';
import { CopyPasteDirective } from './copy-paste.directive';

@Directive({
  selector: '[selectingWithShift]',
})
export class SelectingWithShiftDirective implements OnInit, AfterViewInit {
  @Input() selectedCells: CellSelectionItem[] = [];
  @Input() selectedArea!: HTMLDivElement;
  @Input() selectedCellDatas: CellData[] = [];
  @Input() aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  @Output() selectedCellsChange = new EventEmitter<CellSelectionItem[]>();
  @Output() selectedCellDatasChange = new EventEmitter<CellData[]>();
  @Output() aggregatesChange = new EventEmitter<Aggregate>();

  private arrowKeys: string[] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ];
  private lastSelectedCell!: CellSelectionItem;
  private rowIndex = -1;
  private colIndex = -1;
  private firstSelectedCellRect: Rect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  private lastSelectedCellRect: Rect = { left: 0, top: 0, width: 0, height: 0 };
  private selectedAreaBorder = '';
  private gridData: any[] = [];
  private key: string = '';
  private columns!: ColumnComponent[];

  constructor(
    private grid: GridComponent,
    private renderer2: Renderer2,
    private selectingWithMouseDir: SelectingWithMouseDirective,
    private copyPasteDir: CopyPasteDirective
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    // if we have copied something to the clipboard
    if (this.copyPasteDir.dataCopied) {
      // we need the focus shadow back, if we press anything
      this.renderer2.removeClass(
        this.copyPasteDir.startingCell,
        'no-focus-shadow'
      );
      // if no selection, then reset the selected area
      // this is the case, if we copy only one cell
      if (this.selectedCells.length == 0) resetSelectedArea(this.selectedArea);
      // by pressing esc keep the selection, but remove the dashed border
      if (e.key === 'Escape') {
        this.renderer2.removeClass(this.selectedArea, 'dashed-border');
        this.copyPasteDir.dataCopied = false;
        //navigator.clipboard.writeText(' ');
        return;
      }
    }

    // if we aren't in edit mode and hold the shift key and press any arrow (selecting)
    if (
      !this.grid.isEditingCell() &&
      e.shiftKey &&
      this.arrowKeys.includes(e.key) &&
      this.grid.activeCell.dataRowIndex != -1 // header
    ) {
      // if we copied something to the clipboard, then cancel the copying
      if (this.copyPasteDir.dataCopied) {
        this.renderer2.removeClass(this.selectedArea, 'dashed-border');
        this.renderer2.removeClass(
          this.copyPasteDir.startingCell,
          'no-focus-shadow'
        );
        this.copyPasteDir.dataCopied = false;
      }
    }
  }
}
