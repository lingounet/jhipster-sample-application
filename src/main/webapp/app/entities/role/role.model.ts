import { IPerson } from 'app/entities/person/person.model';

export interface IRole {
  id?: number;
  name?: string | null;
  person?: IPerson | null;
}

export class Role implements IRole {
  constructor(public id?: number, public name?: string | null, public person?: IPerson | null) {}
}

export function getRoleIdentifier(role: IRole): number | undefined {
  return role.id;
}
