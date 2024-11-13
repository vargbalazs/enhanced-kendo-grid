import { Component, inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  CellSelectionItem,
  CreateFormGroupArgs,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import { accountNumbers, calcGridRows, projects } from 'src/app/data/data';
import { DataService } from 'src/app/data/data.service';
import { EnhancedGridDirective } from 'src/app/directives/enhanced-grid.directive';
import { Aggregate } from 'src/app/directives/interfaces/aggregate.interface';
import { ColumnCalculation } from 'src/app/directives/interfaces/column-calculation.interface';
import { FormErrorMessage } from 'src/app/directives/interfaces/form-error-message.interface';
import { ListSource } from 'src/app/directives/interfaces/list-source.interface';
import { RowCalculation } from 'src/app/directives/interfaces/row-calculation.interface';
import { AccountNumber } from 'src/app/model/account-number.model';
import { Project } from 'src/app/model/project.model';
import { Row } from 'src/app/model/row.model';

@Component({
  selector: 'calc-grid-custom-row',
  templateUrl: './calc-grid-custom-row.component.html',
  styleUrls: ['./calc-grid-custom-row.component.css'],
})
export class CalcGridCustomRowComponent {
  @ViewChild(EnhancedGridDirective)
  enhancedGridDirective!: EnhancedGridDirective;
  rows: Row[] = inject(DataService).generateData(50);
  accountNumbers: AccountNumber[] = accountNumbers;
  projects: Project[] = projects;
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
    feb: [0, { validators: [Validators.required, this.customReq()] }],
    mar: [0, Validators.required],
    apr: [0, Validators.required],
    may: [0, Validators.required],
    jun: [0, Validators.required],
    jul: [0, { validators: [Validators.required, this.customReq()] }],
    aug: [0, Validators.required],
    sep: [0, Validators.required],
    oct: [0, Validators.required],
    nov: [0, Validators.required],
    dec: [0, Validators.required],
    category: ['', Validators.required],
  });

  selectableSettings: SelectableSettings = {
    cell: true,
  };

  listSources: ListSource[] = [
    {
      field: 'project.projNumber',
      data: projects,
      valueField: 'id',
      textField: 'projNumber',
    },
    {
      field: 'accountNumber.accNumber',
      data: accountNumbers,
      valueField: 'id',
      textField: 'accNumber',
    },
  ];

  errorMessages: FormErrorMessage[] = [
    {
      error: 'required',
      message: 'field is required',
    },
    {
      error: 'customReq',
      message: 'custom field is required',
    },
  ];

  selectedCells: CellSelectionItem[] = [];
  aggregates: Aggregate = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };

  colCalculation: ColumnCalculation = {
    calculatedColumns: [
      {
        name: 'calc-column1',
        field: 'calccolumn1',
        calculateByColumns: ['jan', 'feb', 'mar'],
        calculateFunction: 'custom',
        customFunction: (
          formGroup: typeof this.formGroup,
          row: Row & { [key: string]: any }
        ) => {
          let result =
            +formGroup.controls.jan.value! +
            +formGroup.controls.feb.value! +
            +formGroup.controls.mar.value!;
          return result;
        },
      },
    ],
  };

  rowCalculation: RowCalculation = {
    titleField: 'id',
    calculatedFields: ['jan', 'feb', 'mar', 'calccolumn1'],
    calculatedRows: [
      {
        name: 'calcsum1',
        title: 'cat 1 sum',
        calculateByField: { fieldName: 'category', fieldValue: 'cat 1' },
        calculateFunction: 'sum',
        cssClass: 'custom-calcrow-1',
        align: 'top',
      },
      {
        name: 'calcsum2',
        title: 'cat 2 sum',
        calculateByField: { fieldName: 'category', fieldValue: 'cat 2' },
        calculateFunction: 'sum',
        cssClass: 'custom-calcrow-2',
        align: 'top',
      },
      {
        name: 'calcsum3',
        title: 'cat 1+ cat 2 sum',
        position: 0,
        calculateByRows: ['calcsum1', 'calcsum2'],
        calculateFunction: 'sum',
        cssClass: 'custom-calcrow-3',
      },
      {
        name: 'calcsum4',
        title: 'cat 3 sum',
        position: 23,
        calculateByRows: { from: 24, to: 33 },
        calculateFunction: 'sum',
        cssClass: 'custom-calcrow-4',
      },
      {
        name: 'calcsum5',
        title: 'cat 4 sum',
        position: 34,
        calculateByRows: {
          from: { field: 'id', value: 31 },
          to: { field: 'id', value: 40 },
        },
        calculateFunction: 'sum',
        cssClass: 'custom-calcrow-5',
      },
      {
        name: 'calcsum6',
        title: 'cat 5 sum',
        position: 45,
        calculateByRows: { from: 46, to: 55 },
        calculateFunction: 'sum',
        cssClass: 'custom-calcrow-6',
      },
    ],
  };

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

  customReq(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value ? { customReq: true } : null;
    };
  }
}
