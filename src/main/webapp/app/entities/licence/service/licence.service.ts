import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILicence, getLicenceIdentifier } from '../licence.model';

export type EntityResponseType = HttpResponse<ILicence>;
export type EntityArrayResponseType = HttpResponse<ILicence[]>;

@Injectable({ providedIn: 'root' })
export class LicenceService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/licences');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(licence: ILicence): Observable<EntityResponseType> {
    return this.http.post<ILicence>(this.resourceUrl, licence, { observe: 'response' });
  }

  update(licence: ILicence): Observable<EntityResponseType> {
    return this.http.put<ILicence>(`${this.resourceUrl}/${getLicenceIdentifier(licence) as string}`, licence, { observe: 'response' });
  }

  partialUpdate(licence: ILicence): Observable<EntityResponseType> {
    return this.http.patch<ILicence>(`${this.resourceUrl}/${getLicenceIdentifier(licence) as string}`, licence, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ILicence>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILicence[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLicenceToCollectionIfMissing(licenceCollection: ILicence[], ...licencesToCheck: (ILicence | null | undefined)[]): ILicence[] {
    const licences: ILicence[] = licencesToCheck.filter(isPresent);
    if (licences.length > 0) {
      const licenceCollectionIdentifiers = licenceCollection.map(licenceItem => getLicenceIdentifier(licenceItem)!);
      const licencesToAdd = licences.filter(licenceItem => {
        const licenceIdentifier = getLicenceIdentifier(licenceItem);
        if (licenceIdentifier == null || licenceCollectionIdentifiers.includes(licenceIdentifier)) {
          return false;
        }
        licenceCollectionIdentifiers.push(licenceIdentifier);
        return true;
      });
      return [...licencesToAdd, ...licenceCollection];
    }
    return licenceCollection;
  }
}
