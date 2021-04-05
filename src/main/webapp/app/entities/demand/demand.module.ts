import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DemandComponent } from './list/demand.component';
import { DemandDetailComponent } from './detail/demand-detail.component';
import { DemandUpdateComponent } from './update/demand-update.component';
import { DemandDeleteDialogComponent } from './delete/demand-delete-dialog.component';
import { DemandRoutingModule } from './route/demand-routing.module';

@NgModule({
  imports: [SharedModule, DemandRoutingModule],
  declarations: [DemandComponent, DemandDetailComponent, DemandUpdateComponent, DemandDeleteDialogComponent],
  entryComponents: [DemandDeleteDialogComponent],
})
export class DemandModule {}
