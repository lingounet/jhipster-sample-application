import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDemand } from '../demand.model';
import { DemandService } from '../service/demand.service';
import { DemandDeleteDialogComponent } from '../delete/demand-delete-dialog.component';

@Component({
  selector: 'jhi-demand',
  templateUrl: './demand.component.html',
})
export class DemandComponent implements OnInit {
  demands?: IDemand[];
  isLoading = false;

  constructor(protected demandService: DemandService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.demandService.query().subscribe(
      (res: HttpResponse<IDemand[]>) => {
        this.isLoading = false;
        this.demands = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDemand): number {
    return item.id!;
  }

  delete(demand: IDemand): void {
    const modalRef = this.modalService.open(DemandDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.demand = demand;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
