import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LicenceComponent } from './list/licence.component';
import { LicenceDetailComponent } from './detail/licence-detail.component';
import { LicenceUpdateComponent } from './update/licence-update.component';
import { LicenceDeleteDialogComponent } from './delete/licence-delete-dialog.component';
import { LicenceRoutingModule } from './route/licence-routing.module';

@NgModule({
  imports: [SharedModule, LicenceRoutingModule],
  declarations: [LicenceComponent, LicenceDetailComponent, LicenceUpdateComponent, LicenceDeleteDialogComponent],
  entryComponents: [LicenceDeleteDialogComponent],
})
export class LicenceModule {}
