import { Component, inject } from '@angular/core';
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
import { Aggregate } from 'src/app/directives/interfaces/aggregate.interface';
import { ColumnCalculation } from 'src/app/directives/interfaces/column-calculation.interface';
import { FormErrorMessage } from 'src/app/directives/interfaces/form-error-message.interface';
import { ListSource } from 'src/app/directives/interfaces/list-source.interface';
import { RowCalculation } from 'src/app/directives/interfaces/row-calculation.interface';
import { AccountNumber } from 'src/app/model/account-number.model';
import { Project } from 'src/app/model/project.model';
import { Row } from 'src/app/model/row.model';

@Component({
  selector: 'calc-grid-only-col-with-filt-sort-page',
  templateUrl: './calc-grid-only-col-with-filt-sort-page.component.html',
  styleUrls: ['./calc-grid-only-col-with-filt-sort-page.component.css'],
  standalone: false,
})
export class CalcGridOnlyColWithFiltSortPageComponent {
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
        name: 'total-q1',
        field: 'totalq1',
        calculateByColumns: ['jan', 'feb', 'mar'],
        calculateFunction: 'sum',
      },
      {
        name: 'total-q2',
        field: 'totalq2',
        calculateByColumns: ['apr', 'may', 'jun'],
        calculateFunction: 'sum',
      },
      {
        name: 'total-1hy',
        field: 'total1hy',
        calculateByColumns: ['totalq1', 'totalq2'],
        calculateFunction: 'sum',
        composed: true,
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
