import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILicence } from '../licence.model';
import { LicenceService } from '../service/licence.service';
import { LicenceDeleteDialogComponent } from '../delete/licence-delete-dialog.component';

@Component({
  selector: 'jhi-licence',
  templateUrl: './licence.component.html',
})
export class LicenceComponent implements OnInit {
  licences?: ILicence[];
  isLoading = false;

  constructor(protected licenceService: LicenceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.licenceService.query().subscribe(
      (res: HttpResponse<ILicence[]>) => {
        this.isLoading = false;
        this.licences = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILicence): string {
    return item.id!;
  }

  delete(licence: ILicence): void {
    const modalRef = this.modalService.open(LicenceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.licence = licence;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
