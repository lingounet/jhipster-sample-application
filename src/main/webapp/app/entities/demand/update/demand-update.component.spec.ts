jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DemandService } from '../service/demand.service';
import { IDemand, Demand } from '../demand.model';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

import { DemandUpdateComponent } from './demand-update.component';

describe('Component Tests', () => {
  describe('Demand Management Update Component', () => {
    let comp: DemandUpdateComponent;
    let fixture: ComponentFixture<DemandUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let demandService: DemandService;
    let businessService: BusinessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DemandUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DemandUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DemandUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      demandService = TestBed.inject(DemandService);
      businessService = TestBed.inject(BusinessService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Business query and add missing value', () => {
        const demand: IDemand = { id: 456 };
        const business: IBusiness = { id: 50992 };
        demand.business = business;

        const businessCollection: IBusiness[] = [{ id: 47954 }];
        spyOn(businessService, 'query').and.returnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [business];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        spyOn(businessService, 'addBusinessToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ demand });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const demand: IDemand = { id: 456 };
        const business: IBusiness = { id: 93114 };
        demand.business = business;

        activatedRoute.data = of({ demand });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(demand));
        expect(comp.businessesSharedCollection).toContain(business);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const demand = { id: 123 };
        spyOn(demandService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ demand });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: demand }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(demandService.update).toHaveBeenCalledWith(demand);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const demand = new Demand();
        spyOn(demandService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ demand });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: demand }));
        saveSubject.complete();

        // THEN
        expect(demandService.create).toHaveBeenCalledWith(demand);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const demand = { id: 123 };
        spyOn(demandService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ demand });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(demandService.update).toHaveBeenCalledWith(demand);
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
