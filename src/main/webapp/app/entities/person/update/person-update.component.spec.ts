jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PersonService } from '../service/person.service';
import { IPerson, Person } from '../person.model';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

import { PersonUpdateComponent } from './person-update.component';

describe('Component Tests', () => {
  describe('Person Management Update Component', () => {
    let comp: PersonUpdateComponent;
    let fixture: ComponentFixture<PersonUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let personService: PersonService;
    let businessService: BusinessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PersonUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PersonUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PersonUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      personService = TestBed.inject(PersonService);
      businessService = TestBed.inject(BusinessService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Business query and add missing value', () => {
        const person: IPerson = { id: 456 };
        const business: IBusiness = { id: 25189 };
        person.business = business;

        const businessCollection: IBusiness[] = [{ id: 8703 }];
        spyOn(businessService, 'query').and.returnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [business];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        spyOn(businessService, 'addBusinessToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ person });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const person: IPerson = { id: 456 };
        const business: IBusiness = { id: 45911 };
        person.business = business;

        activatedRoute.data = of({ person });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(person));
        expect(comp.businessesSharedCollection).toContain(business);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const person = { id: 123 };
        spyOn(personService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ person });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: person }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(personService.update).toHaveBeenCalledWith(person);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const person = new Person();
        spyOn(personService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ person });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: person }));
        saveSubject.complete();

        // THEN
        expect(personService.create).toHaveBeenCalledWith(person);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const person = { id: 123 };
        spyOn(personService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ person });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(personService.update).toHaveBeenCalledWith(person);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBusinessById', () => {
        it('Should return tracked Business primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBusinessById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
