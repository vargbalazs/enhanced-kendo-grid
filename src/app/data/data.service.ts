import { Injectable } from '@angular/core';
import { Row } from '../model/row.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  generateData(rowNumber: number): Row[] {
    let rows: Row[] = [];
    for (let i = 1; i <= rowNumber; i++) {
      rows.push({
        id: i,
        accountNumber: {
          id: i,
          accNumber: `acc numb ${i}`,
          accName: `acc name ${i}`,
        },
        project: {
          id: i,
          projNumber: `proj numb ${i}`,
          projName: `proj name ${i}`,
        },
        jan: Math.round(Math.random() * 1000),
        feb: Math.round(Math.random() * 1000),
        mar: Math.round(Math.random() * 1000),
        apr: Math.round(Math.random() * 1000),
        may: Math.round(Math.random() * 1000),
        jun: Math.round(Math.random() * 1000),
        jul: Math.round(Math.random() * 1000),
        aug: Math.round(Math.random() * 1000),
        sep: Math.round(Math.random() * 1000),
        oct: Math.round(Math.random() * 1000),
        nov: Math.round(Math.random() * 1000),
        dec: Math.round(Math.random() * 1000),
        category: `cat ${Math.ceil(i / 10)}`,
      });
    }

    return rows;
  }
}
