jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LicenceService } from '../service/licence.service';
import { ILicence, Licence } from '../licence.model';
import { IDemand } from 'app/entities/demand/demand.model';
import { DemandService } from 'app/entities/demand/service/demand.service';

import { LicenceUpdateComponent } from './licence-update.component';

describe('Component Tests', () => {
  describe('Licence Management Update Component', () => {
    let comp: LicenceUpdateComponent;
    let fixture: ComponentFixture<LicenceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let licenceService: LicenceService;
    let demandService: DemandService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LicenceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LicenceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LicenceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      licenceService = TestBed.inject(LicenceService);
      demandService = TestBed.inject(DemandService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Demand query and add missing value', () => {
        const licence: ILicence = { id: 'CBA' };
        const demand: IDemand = { id: 482 };
        licence.demand = demand;

        const demandCollection: IDemand[] = [{ id: 6000 }];
        spyOn(demandService, 'query').and.returnValue(of(new HttpResponse({ body: demandCollection })));
        const additionalDemands = [demand];
        const expectedCollection: IDemand[] = [...additionalDemands, ...demandCollection];
        spyOn(demandService, 'addDemandToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ licence });
        comp.ngOnInit();

        expect(demandService.query).toHaveBeenCalled();
        expect(demandService.addDemandToCollectionIfMissing).toHaveBeenCalledWith(demandCollection, ...additionalDemands);
        expect(comp.demandsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const licence: ILicence = { id: 'CBA' };
        const demand: IDemand = { id: 8152 };
        licence.demand = demand;

        activatedRoute.data = of({ licence });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(licence));
        expect(comp.demandsSharedCollection).toContain(demand);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const licence = { id: 'ABC' };
        spyOn(licenceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ licence });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: licence }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(licenceService.update).toHaveBeenCalledWith(licence);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const licence = new Licence();
        spyOn(licenceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ licence });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: licence }));
        saveSubject.complete();

        // THEN
        expect(licenceService.create).toHaveBeenCalledWith(licence);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const licence = { id: 'ABC' };
        spyOn(licenceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ licence });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(licenceService.update).toHaveBeenCalledWith(licence);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackDemandById', () => {
        it('Should return tracked Demand primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDemandById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
