import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CellSelectionItem,
  CreateFormGroupArgs,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { accountNumbers, projects, rows } from 'src/app/data/data';
import { Aggregate } from 'src/app/directives/interfaces/aggregate.interface';
import { AccountNumber } from 'src/app/model/account-number.model';
import { Project } from 'src/app/model/project.model';
import { Row } from 'src/app/model/row.model';

@Component({
  selector: 'normal-grid',
  templateUrl: './normal-grid.component.html',
  styleUrls: ['./normal-grid.component.css'],
})
export class NormalGridComponent {
  rows: Row[] = rows;
  accountNumbers: AccountNumber[] = accountNumbers;
  projects: Project[] = projects;
  groups: GroupDescriptor[] = [{ field: 'category' }];
  frozenColumns = [
    'accountNumber.accNumber',
    'id',
    'accountNumber.accName',
    'project.projNumber',
    'category',
  ];

  formGroup = this.formBuilder.group({
    accountNumber: [{ id: 0, accNumber: '', accName: '' }, Validators.required],
    project: [{ id: 0, projNumber: '', projName: '' }, Validators.required],
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
    total: [0],
    category: ['', Validators.required],
  });

  selectableSettings: SelectableSettings = {
    cell: true,
  };

  selectedCells: CellSelectionItem[] = [];
  aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  constructor(private formBuilder: FormBuilder) {
    this.calculateTotal(this.rows);
    this.createFormGroup = this.createFormGroup.bind(this);
    this.formGroup.valueChanges.subscribe((value) => {
      this.calculateTotalFromFormGroup(this.formGroup);
    });
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

  calculateTotal(rows: Row[]) {
    rows.forEach(
      (row) =>
        (row.total =
          row.jan! +
          row.feb! +
          row.mar! +
          row.apr! +
          row.may! +
          row.jun! +
          row.jul! +
          row.aug! +
          row.sep! +
          row.oct! +
          row.nov! +
          row.dec!)
    );
  }

  calculateTotalFromFormGroup(formGroup: typeof this.formGroup) {
    formGroup.controls.total.setValue(
      this.anyToNumber(formGroup.controls.jan.value) +
        this.anyToNumber(formGroup.controls.feb.value) +
        this.anyToNumber(formGroup.controls.mar.value) +
        this.anyToNumber(formGroup.controls.apr.value) +
        this.anyToNumber(formGroup.controls.may.value) +
        this.anyToNumber(formGroup.controls.jun.value) +
        this.anyToNumber(formGroup.controls.jul.value) +
        this.anyToNumber(formGroup.controls.aug.value) +
        this.anyToNumber(formGroup.controls.sep.value) +
        this.anyToNumber(formGroup.controls.oct.value) +
        this.anyToNumber(formGroup.controls.nov.value) +
        this.anyToNumber(formGroup.controls.dec.value),
      { emitEvent: false }
    );
  }

  anyToNumber(value: any): number {
    if (!isFinite(+value)) return 0;
    return +value;
  }
}
