import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILicence, Licence } from '../licence.model';
import { LicenceService } from '../service/licence.service';
import { IDemand } from 'app/entities/demand/demand.model';
import { DemandService } from 'app/entities/demand/service/demand.service';

@Component({
  selector: 'jhi-licence-update',
  templateUrl: './licence-update.component.html',
})
export class LicenceUpdateComponent implements OnInit {
  isSaving = false;

  demandsSharedCollection: IDemand[] = [];

  editForm = this.fb.group({
    id: [],
    price: [],
    reference: [],
    demand: [],
  });

  constructor(
    protected licenceService: LicenceService,
    protected demandService: DemandService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ licence }) => {
      this.updateForm(licence);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const licence = this.createFromForm();
    if (licence.id !== undefined) {
      this.subscribeToSaveResponse(this.licenceService.update(licence));
    } else {
      this.subscribeToSaveResponse(this.licenceService.create(licence));
    }
  }

  trackDemandById(index: number, item: IDemand): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILicence>>): void {
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

  protected updateForm(licence: ILicence): void {
    this.editForm.patchValue({
      id: licence.id,
      price: licence.price,
      reference: licence.reference,
      demand: licence.demand,
    });

    this.demandsSharedCollection = this.demandService.addDemandToCollectionIfMissing(this.demandsSharedCollection, licence.demand);
  }

  protected loadRelationshipsOptions(): void {
    this.demandService
      .query()
      .pipe(map((res: HttpResponse<IDemand[]>) => res.body ?? []))
      .pipe(map((demands: IDemand[]) => this.demandService.addDemandToCollectionIfMissing(demands, this.editForm.get('demand')!.value)))
      .subscribe((demands: IDemand[]) => (this.demandsSharedCollection = demands));
  }

  protected createFromForm(): ILicence {
    return {
      ...new Licence(),
      id: this.editForm.get(['id'])!.value,
      price: this.editForm.get(['price'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      demand: this.editForm.get(['demand'])!.value,
    };
  }
}
