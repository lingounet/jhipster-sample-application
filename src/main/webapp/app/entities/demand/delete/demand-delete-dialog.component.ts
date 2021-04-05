import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDemand } from '../demand.model';
import { DemandService } from '../service/demand.service';

@Component({
  templateUrl: './demand-delete-dialog.component.html',
})
export class DemandDeleteDialogComponent {
  demand?: IDemand;

  constructor(protected demandService: DemandService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.demandService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
