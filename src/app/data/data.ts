import { AccountNumber } from '../model/account-number.model';
import { Project } from '../model/project.model';
import { Row } from '../model/row.model';

export const rows: Row[] = generateData(200);
export const calcGridRows: Row[] = generateData(50);
export const accountNumbers: AccountNumber[] = generateAccountNumbers();
export const projects: Project[] = generateProjects();

function generateData(rowNumber: number): Row[] {
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

function generateAccountNumbers(): AccountNumber[] {
  let accountNumbers: AccountNumber[] = [];
  for (let i = 1; i <= 200; i++) {
    accountNumbers.push({
      id: i,
      accNumber: `acc numb ${i}`,
      accName: `acc name ${i}`,
    });
  }

  return accountNumbers;
}

function generateProjects(): Project[] {
  let projects: Project[] = [];
  for (let i = 1; i <= 200; i++) {
    projects.push({
      id: i,
      projNumber: `proj numb ${i}`,
      projName: `proj name ${i}`,
    });
  }

  return projects;
}
