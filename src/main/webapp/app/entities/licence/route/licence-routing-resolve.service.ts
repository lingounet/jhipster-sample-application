import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILicence, Licence } from '../licence.model';
import { LicenceService } from '../service/licence.service';

@Injectable({ providedIn: 'root' })
export class LicenceRoutingResolveService implements Resolve<ILicence> {
  constructor(protected service: LicenceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILicence> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((licence: HttpResponse<Licence>) => {
          if (licence.body) {
            return of(licence.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Licence());
  }
}
