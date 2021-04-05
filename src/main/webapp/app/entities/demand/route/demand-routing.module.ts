import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DemandComponent } from '../list/demand.component';
import { DemandDetailComponent } from '../detail/demand-detail.component';
import { DemandUpdateComponent } from '../update/demand-update.component';
import { DemandRoutingResolveService } from './demand-routing-resolve.service';

const demandRoute: Routes = [
  {
    path: '',
    component: DemandComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DemandDetailComponent,
    resolve: {
      demand: DemandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DemandUpdateComponent,
    resolve: {
      demand: DemandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DemandUpdateComponent,
    resolve: {
      demand: DemandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(demandRoute)],
  exports: [RouterModule],
})
export class DemandRoutingModule {}
