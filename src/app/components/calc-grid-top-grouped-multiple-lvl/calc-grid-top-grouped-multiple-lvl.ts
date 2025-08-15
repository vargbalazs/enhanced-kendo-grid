import { Component, inject, OnInit } from '@angular/core';
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
import { delay, Observable, of } from 'rxjs';
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
  selector: 'calc-grid-top-grouped-multiple-lvl',
  templateUrl: './calc-grid-top-grouped-multiple-lvl.component.html',
  styleUrls: ['./calc-grid-top-grouped-multiple-lvl.component.css'],
  standalone: false,
})
export class CalcGridTopGroupedMultipleLevelComponent implements OnInit {
  rows: Row[] = inject(DataService).generateData(50);
  rows$!: Observable<Row[]>;
  accountNumbers: AccountNumber[] = accountNumbers;
  projects: Project[] = projects;
  frozenColumns = [
    'grouplevel1',
    'grouplevel2',
    'grouplevel3',
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
    bool: [false, Validators.required],
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

  rowCalculation: RowCalculation =
    // {
    //   titleField: '',
    //   calculatedFields: [],
    //   calculatedRows: [],
    // };
    {
      titleField: 'id',
      calculatedFields: [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'totalq1',
        'totalq2',
        'total1hy',
      ],
      calculatedRows: [
        {
          name: 'calcsum1',
          title: 'cat 1 sum',
          calculateByField: { fieldName: 'category', fieldValue: 'cat 1' },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-1',
          align: 'top',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum1-2',
        },
        {
          name: 'calcsum2',
          title: 'cat 2 sum',
          calculateByField: { fieldName: 'category', fieldValue: 'cat 2' },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-2',
          align: 'top',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum1-2',
        },
        {
          name: 'calcsum5',
          title: 'cat 5 sum',
          calculateByField: { fieldName: 'category', fieldValue: 'cat 5' },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-5',
          align: 'top',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum3-4-5',
        },
        {
          name: 'calcsum1-2',
          title: 'cat 1 + cat 2 sum',
          position: 0,
          calculateByRows: ['calcsum1', 'calcsum2'],
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-1-2',
          state: 'expanded',
          groupLevel: 2,
          parentRowName: 'calcsum-total',
        },
        {
          name: 'calcsum3',
          title: 'cat 3 sum',
          position: 23,
          calculateByRows: { from: 26, to: 35 },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-3',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum3-4-5',
        },
        {
          name: 'calcsum4',
          title: 'cat 4 sum',
          position: 34,
          calculateByRows: {
            from: { field: 'id', value: 31 },
            to: { field: 'id', value: 40 },
          },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-4',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum3-4-5',
        },
        {
          name: 'calcsum3-4-5',
          title: 'cat 3 + cat 4 + cat 5 sum',
          position: 23,
          calculateByRows: ['calcsum3', 'calcsum4', 'calcsum5'],
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-3-4-5',
          state: 'expanded',
          groupLevel: 2,
          parentRowName: 'calcsum-total',
        },
        {
          name: 'calcsum-total',
          title: 'total sum',
          position: 0,
          calculateByRows: ['calcsum1-2', 'calcsum3-4-5'],
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-total',
          state: 'expanded',
          groupLevel: 1,
        },
      ],
    };

  constructor(private formBuilder: FormBuilder) {
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  ngOnInit(): void {
    this.rows$ = of(this.rows).pipe(delay(2000));
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

  addCalcRows() {
    this.rowCalculation = {
      titleField: 'id',
      calculatedFields: [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'totalq1',
        'totalq2',
        'total1hy',
      ],
      calculatedRows: [
        {
          name: 'calcsum1',
          title: 'cat 1 sum',
          calculateByField: { fieldName: 'category', fieldValue: 'cat 1' },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-1',
          align: 'top',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum1-2',
        },
        {
          name: 'calcsum2',
          title: 'cat 2 sum',
          calculateByField: { fieldName: 'category', fieldValue: 'cat 2' },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-2',
          align: 'top',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum1-2',
        },
        {
          name: 'calcsum5',
          title: 'cat 5 sum',
          calculateByField: { fieldName: 'category', fieldValue: 'cat 5' },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-5',
          align: 'top',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum3-4-5',
        },
        {
          name: 'calcsum1-2',
          title: 'cat 1 + cat 2 sum',
          position: 0,
          calculateByRows: ['calcsum1', 'calcsum2'],
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-1-2',
          state: 'expanded',
          groupLevel: 2,
          parentRowName: 'calcsum-total',
        },
        {
          name: 'calcsum3',
          title: 'cat 3 sum',
          position: 23,
          calculateByRows: { from: 26, to: 35 },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-3',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum3-4-5',
        },
        {
          name: 'calcsum4',
          title: 'cat 4 sum',
          position: 34,
          calculateByRows: {
            from: { field: 'id', value: 31 },
            to: { field: 'id', value: 40 },
          },
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-4',
          state: 'expanded',
          groupLevel: 3,
          parentRowName: 'calcsum3-4-5',
        },
        {
          name: 'calcsum3-4-5',
          title: 'cat 3 + cat 4 + cat 5 sum',
          position: 23,
          calculateByRows: ['calcsum3', 'calcsum4', 'calcsum5'],
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-3-4-5',
          state: 'expanded',
          groupLevel: 2,
          parentRowName: 'calcsum-total',
        },
        {
          name: 'calcsum-total',
          title: 'total sum',
          position: 0,
          calculateByRows: ['calcsum1-2', 'calcsum3-4-5'],
          calculateFunction: 'sum',
          cssClass: 'custom-calcrow-total',
          state: 'expanded',
          groupLevel: 1,
        },
      ],
    };
  }
}
