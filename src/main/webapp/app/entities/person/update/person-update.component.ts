import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPerson, Person } from '../person.model';
import { PersonService } from '../service/person.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

@Component({
  selector: 'jhi-person-update',
  templateUrl: './person-update.component.html',
})
export class PersonUpdateComponent implements OnInit {
  isSaving = false;

  businessesSharedCollection: IBusiness[] = [];

  editForm = this.fb.group({
    id: [],
    sgid: [],
    business: [],
  });

  constructor(
    protected personService: PersonService,
    protected businessService: BusinessService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ person }) => {
      this.updateForm(person);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const person = this.createFromForm();
    if (person.id !== undefined) {
      this.subscribeToSaveResponse(this.personService.update(person));
    } else {
      this.subscribeToSaveResponse(this.personService.create(person));
    }
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerson>>): void {
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

  protected updateForm(person: IPerson): void {
    this.editForm.patchValue({
      id: person.id,
      sgid: person.sgid,
      business: person.business,
    });

    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      person.business
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

  protected createFromForm(): IPerson {
    return {
      ...new Person(),
      id: this.editForm.get(['id'])!.value,
      sgid: this.editForm.get(['sgid'])!.value,
      business: this.editForm.get(['business'])!.value,
    };
  }
}
