import { AccountNumber } from './account-number.model';

export interface Row {
  id?: number;
  accountNumber?: AccountNumber;
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
}
