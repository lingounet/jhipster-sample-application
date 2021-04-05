import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBusiness, Business } from '../business.model';
import { BusinessService } from '../service/business.service';
import { ILicence } from 'app/entities/licence/licence.model';
import { LicenceService } from 'app/entities/licence/service/licence.service';

@Component({
  selector: 'jhi-business-update',
  templateUrl: './business-update.component.html',
})
export class BusinessUpdateComponent implements OnInit {
  isSaving = false;

  licencesSharedCollection: ILicence[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    name: [],
    licence: [],
  });

  constructor(
    protected businessService: BusinessService,
    protected licenceService: LicenceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ business }) => {
      this.updateForm(business);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const business = this.createFromForm();
    if (business.id !== undefined) {
      this.subscribeToSaveResponse(this.businessService.update(business));
    } else {
      this.subscribeToSaveResponse(this.businessService.create(business));
    }
  }

  trackLicenceById(index: number, item: ILicence): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusiness>>): void {
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

  protected updateForm(business: IBusiness): void {
    this.editForm.patchValue({
      id: business.id,
      code: business.code,
      name: business.name,
      licence: business.licence,
    });

    this.licencesSharedCollection = this.licenceService.addLicenceToCollectionIfMissing(this.licencesSharedCollection, business.licence);
  }

  protected loadRelationshipsOptions(): void {
    this.licenceService
      .query()
      .pipe(map((res: HttpResponse<ILicence[]>) => res.body ?? []))
      .pipe(
        map((licences: ILicence[]) => this.licenceService.addLicenceToCollectionIfMissing(licences, this.editForm.get('licence')!.value))
      )
      .subscribe((licences: ILicence[]) => (this.licencesSharedCollection = licences));
  }

  protected createFromForm(): IBusiness {
    return {
      ...new Business(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      licence: this.editForm.get(['licence'])!.value,
    };
  }
}
