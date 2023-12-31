import { AccountNumber } from '../model/account-number.model';
import { Row } from '../model/row.model';

export const rows: Row[] = generateData();
export const accountNumbers: AccountNumber[] = generateAccountNumbers();

function generateData(): Row[] {
  let rows: Row[] = [];
  for (let i = 1; i <= 10; i++) {
    rows.push({
      id: i,
      accountNumber: { id: i, accNumber: `acc numb ${i}` },
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
    });
  }

  return rows;
}

function generateAccountNumbers(): AccountNumber[] {
  let accountNumbers: AccountNumber[] = [];
  for (let i = 1; i <= 10; i++) {
    accountNumbers.push({ id: i, accNumber: `acc numb ${i}` });
  }

  return accountNumbers;
}
