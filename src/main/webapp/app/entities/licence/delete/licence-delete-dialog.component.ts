import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILicence } from '../licence.model';
import { LicenceService } from '../service/licence.service';

@Component({
  templateUrl: './licence-delete-dialog.component.html',
})
export class LicenceDeleteDialogComponent {
  licence?: ILicence;

  constructor(protected licenceService: LicenceService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.licenceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
