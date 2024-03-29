import { Component, ElementRef, ViewChild } from '@angular/core';
import { Row } from './model/row.model';
import { accountNumbers, rows } from './data/data';
import {
  CellSelectionItem,
  CreateFormGroupArgs,
  GridComponent,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountNumber } from './model/account-number.model';
import { CellData } from './interfaces/celldata.interface';
import { Aggregate } from './interfaces/aggregate.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'enhanced-kendo-grid';

  rows: Row[] = rows;
  accountNumbers: AccountNumber[] = accountNumbers;

  formGroup = this.formBuilder.group({
    accountNumber: [{ id: 0, accNumber: '' }, Validators.required],
    jan: [0, Validators.required],
    feb: [0, Validators.required],
    mar: [0, Validators.required],
    apr: [0, Validators.required],
    may: [0, Validators.required],
    jun: [0, Validators.required],
    jul: [0, Validators.required],
    aug: [0, Validators.required],
    sep: [0, Validators.required],
    oct: [0, Validators.required],
    nov: [0, Validators.required],
    dec: [0, Validators.required],
  });

  @ViewChild('grid') grid!: GridComponent;
  @ViewChild('selectedArea', { read: ElementRef })
  selectedArea!: ElementRef<any>;

  selectableSettings: SelectableSettings = {
    cell: true,
  };

  selectedCells: CellSelectionItem[] = [];
  selectedDatas: CellData[] = [];
  aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  constructor(private formBuilder: FormBuilder) {
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  createFormGroup(args: CreateFormGroupArgs): FormGroup {
    const item = <Row>args.dataItem;
    this.formGroup.reset(item);
    return this.formGroup;
  }

  checkDuplicates(): boolean {
    const unique = this.selectedCells.filter(
      (item1, index) =>
        this.selectedCells.findIndex(
          (item2) =>
            item2.itemKey === item1.itemKey &&
            item2.columnKey === item1.columnKey
        ) === index
    );
    return unique.length === this.selectedCells.length;
  }
}
