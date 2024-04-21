import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CellSelectionItem,
  CreateFormGroupArgs,
  DataStateChangeEvent,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  GroupDescriptor,
  State,
  process,
} from '@progress/kendo-data-query';
import { accountNumbers, projects, rows } from 'src/app/data/data';
import { Aggregate } from 'src/app/directives/interfaces/aggregate.interface';
import { AccountNumber } from 'src/app/model/account-number.model';
import { Project } from 'src/app/model/project.model';
import { Row } from 'src/app/model/row.model';

@Component({
  selector: 'grouped-grid',
  templateUrl: './grouped-grid.component.html',
  styleUrls: ['./grouped-grid.component.css'],
})
export class GroupedGridComponent {
  rows: Row[] = rows;
  accountNumbers: AccountNumber[] = accountNumbers;
  projects: Project[] = projects;
  groupAggregates: AggregateDescriptor[] = [{ field: 'jan', aggregate: 'sum' }];
  groups: GroupDescriptor[] = [
    { field: 'category', aggregates: this.groupAggregates },
  ];
  state: State = {
    group: [{ field: 'category', aggregates: this.groupAggregates }],
  };

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
    category: ['', Validators.required],
  });

  selectableSettings: SelectableSettings = {
    cell: true,
  };

  selectedCells: CellSelectionItem[] = [];
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

  dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map((group) => (group.aggregates = this.groupAggregates));
    }
    this.state = state;
    this.rows = process(rows, this.state).data;
  }
}
