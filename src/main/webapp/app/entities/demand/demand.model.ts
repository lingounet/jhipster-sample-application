import { ILicence } from 'app/entities/licence/licence.model';
import { IBusiness } from 'app/entities/business/business.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IDemand {
  id?: number;
  status?: Status | null;
  email?: string | null;
  number?: number | null;
  licences?: ILicence[] | null;
  business?: IBusiness | null;
}

export class Demand implements IDemand {
  constructor(
    public id?: number,
    public status?: Status | null,
    public email?: string | null,
    public number?: number | null,
    public licences?: ILicence[] | null,
    public business?: IBusiness | null
  ) {}
}

export function getDemandIdentifier(demand: IDemand): number | undefined {
  return demand.id;
}
