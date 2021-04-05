import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LicenceComponent } from '../list/licence.component';
import { LicenceDetailComponent } from '../detail/licence-detail.component';
import { LicenceUpdateComponent } from '../update/licence-update.component';
import { LicenceRoutingResolveService } from './licence-routing-resolve.service';

const licenceRoute: Routes = [
  {
    path: '',
    component: LicenceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LicenceDetailComponent,
    resolve: {
      licence: LicenceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LicenceUpdateComponent,
    resolve: {
      licence: LicenceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LicenceUpdateComponent,
    resolve: {
      licence: LicenceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(licenceRoute)],
  exports: [RouterModule],
})
export class LicenceRoutingModule {}
