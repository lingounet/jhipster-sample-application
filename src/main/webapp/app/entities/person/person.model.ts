import { IRole } from 'app/entities/role/role.model';
import { IBusiness } from 'app/entities/business/business.model';

export interface IPerson {
  id?: number;
  sgid?: string | null;
  roles?: IRole[] | null;
  business?: IBusiness | null;
}

export class Person implements IPerson {
  constructor(public id?: number, public sgid?: string | null, public roles?: IRole[] | null, public business?: IBusiness | null) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
