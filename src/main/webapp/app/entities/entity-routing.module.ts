import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'business',
        data: { pageTitle: 'jhipsterSampleApplicationApp.business.home.title' },
        loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
      },
      {
        path: 'person',
        data: { pageTitle: 'jhipsterSampleApplicationApp.person.home.title' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'role',
        data: { pageTitle: 'jhipsterSampleApplicationApp.role.home.title' },
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
      },
      {
        path: 'licence',
        data: { pageTitle: 'jhipsterSampleApplicationApp.licence.home.title' },
        loadChildren: () => import('./licence/licence.module').then(m => m.LicenceModule),
      },
      {
        path: 'demand',
        data: { pageTitle: 'jhipsterSampleApplicationApp.demand.home.title' },
        loadChildren: () => import('./demand/demand.module').then(m => m.DemandModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
