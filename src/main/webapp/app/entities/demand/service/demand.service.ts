import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDemand, getDemandIdentifier } from '../demand.model';

export type EntityResponseType = HttpResponse<IDemand>;
export type EntityArrayResponseType = HttpResponse<IDemand[]>;

@Injectable({ providedIn: 'root' })
export class DemandService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/demands');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(demand: IDemand): Observable<EntityResponseType> {
    return this.http.post<IDemand>(this.resourceUrl, demand, { observe: 'response' });
  }

  update(demand: IDemand): Observable<EntityResponseType> {
    return this.http.put<IDemand>(`${this.resourceUrl}/${getDemandIdentifier(demand) as number}`, demand, { observe: 'response' });
  }

  partialUpdate(demand: IDemand): Observable<EntityResponseType> {
    return this.http.patch<IDemand>(`${this.resourceUrl}/${getDemandIdentifier(demand) as number}`, demand, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDemand>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDemand[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDemandToCollectionIfMissing(demandCollection: IDemand[], ...demandsToCheck: (IDemand | null | undefined)[]): IDemand[] {
    const demands: IDemand[] = demandsToCheck.filter(isPresent);
    if (demands.length > 0) {
      const demandCollectionIdentifiers = demandCollection.map(demandItem => getDemandIdentifier(demandItem)!);
      const demandsToAdd = demands.filter(demandItem => {
        const demandIdentifier = getDemandIdentifier(demandItem);
        if (demandIdentifier == null || demandCollectionIdentifiers.includes(demandIdentifier)) {
          return false;
        }
        demandCollectionIdentifiers.push(demandIdentifier);
        return true;
      });
      return [...demandsToAdd, ...demandCollection];
    }
    return demandCollection;
  }
}
