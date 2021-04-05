import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDemand, Demand } from '../demand.model';
import { DemandService } from '../service/demand.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

@Component({
  selector: 'jhi-demand-update',
  templateUrl: './demand-update.component.html',
})
export class DemandUpdateComponent implements OnInit {
  isSaving = false;

  businessesSharedCollection: IBusiness[] = [];

  editForm = this.fb.group({
    id: [],
    status: [],
    email: [],
    number: [],
    business: [],
  });

  constructor(
    protected demandService: DemandService,
    protected businessService: BusinessService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ demand }) => {
      this.updateForm(demand);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const demand = this.createFromForm();
    if (demand.id !== undefined) {
      this.subscribeToSaveResponse(this.demandService.update(demand));
    } else {
      this.subscribeToSaveResponse(this.demandService.create(demand));
    }
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDemand>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(demand: IDemand): void {
    this.editForm.patchValue({
      id: demand.id,
      status: demand.status,
      email: demand.email,
      number: demand.number,
      business: demand.business,
    });

    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      demand.business
    );
  }

  protected loadRelationshipsOptions(): void {
    this.businessService
      .query()
      .pipe(map((res: HttpResponse<IBusiness[]>) => res.body ?? []))
      .pipe(
        map((businesses: IBusiness[]) =>
          this.businessService.addBusinessToCollectionIfMissing(businesses, this.editForm.get('business')!.value)
        )
      )
      .subscribe((businesses: IBusiness[]) => (this.businessesSharedCollection = businesses));
  }

  protected createFromForm(): IDemand {
    return {
      ...new Demand(),
      id: this.editForm.get(['id'])!.value,
      status: this.editForm.get(['status'])!.value,
      email: this.editForm.get(['email'])!.value,
      number: this.editForm.get(['number'])!.value,
      business: this.editForm.get(['business'])!.value,
    };
  }
}
