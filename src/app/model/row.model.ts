import { AccountNumber } from './account-number.model';
import { Project } from './project.model';

export interface Row {
  id?: number;
  accountNumber?: AccountNumber;
  project?: Project;
  jan?: number;
  feb?: number;
  mar?: number;
  apr?: number;
  may?: number;
  jun?: number;
  jul?: number;
  aug?: number;
  sep?: number;
  oct?: number;
  nov?: number;
  dec?: number;
  total?: number;
}
