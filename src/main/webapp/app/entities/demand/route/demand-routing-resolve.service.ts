import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDemand, Demand } from '../demand.model';
import { DemandService } from '../service/demand.service';

@Injectable({ providedIn: 'root' })
export class DemandRoutingResolveService implements Resolve<IDemand> {
  constructor(protected service: DemandService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDemand> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((demand: HttpResponse<Demand>) => {
          if (demand.body) {
            return of(demand.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Demand());
  }
}
