import { IDemand } from 'app/entities/demand/demand.model';
import { IBusiness } from 'app/entities/business/business.model';

export interface ILicence {
  id?: string;
  price?: number | null;
  reference?: string | null;
  demand?: IDemand | null;
  businesses?: IBusiness[] | null;
}

export class Licence implements ILicence {
  constructor(
    public id?: string,
    public price?: number | null,
    public reference?: string | null,
    public demand?: IDemand | null,
    public businesses?: IBusiness[] | null
  ) {}
}

export function getLicenceIdentifier(licence: ILicence): string | undefined {
  return licence.id;
}
