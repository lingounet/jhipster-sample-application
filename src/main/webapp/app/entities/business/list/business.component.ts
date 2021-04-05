import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';
import { BusinessDeleteDialogComponent } from '../delete/business-delete-dialog.component';

@Component({
  selector: 'jhi-business',
  templateUrl: './business.component.html',
})
export class BusinessComponent implements OnInit {
  businesses?: IBusiness[];
  isLoading = false;

  constructor(protected businessService: BusinessService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.businessService.query().subscribe(
      (res: HttpResponse<IBusiness[]>) => {
        this.isLoading = false;
        this.businesses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBusiness): number {
    return item.id!;
  }

  delete(business: IBusiness): void {
    const modalRef = this.modalService.open(BusinessDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.business = business;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
