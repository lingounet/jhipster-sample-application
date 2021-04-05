import { IPerson } from 'app/entities/person/person.model';
import { IDemand } from 'app/entities/demand/demand.model';
import { ILicence } from 'app/entities/licence/licence.model';

export interface IBusiness {
  id?: number;
  code?: string | null;
  name?: string | null;
  people?: IPerson[] | null;
  demands?: IDemand[] | null;
  licence?: ILicence | null;
}

export class Business implements IBusiness {
  constructor(
    public id?: number,
    public code?: string | null,
    public name?: string | null,
    public people?: IPerson[] | null,
    public demands?: IDemand[] | null,
    public licence?: ILicence | null
  ) {}
}

export function getBusinessIdentifier(business: IBusiness): number | undefined {
  return business.id;
}
