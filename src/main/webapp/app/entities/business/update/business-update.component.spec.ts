jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BusinessService } from '../service/business.service';
import { IBusiness, Business } from '../business.model';
import { ILicence } from 'app/entities/licence/licence.model';
import { LicenceService } from 'app/entities/licence/service/licence.service';

import { BusinessUpdateComponent } from './business-update.component';

describe('Component Tests', () => {
  describe('Business Management Update Component', () => {
    let comp: BusinessUpdateComponent;
    let fixture: ComponentFixture<BusinessUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let businessService: BusinessService;
    let licenceService: LicenceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BusinessUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BusinessUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      businessService = TestBed.inject(BusinessService);
      licenceService = TestBed.inject(LicenceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Licence query and add missing value', () => {
        const business: IBusiness = { id: 456 };
        const licence: ILicence = { id: 'auxiliary Executive Home' };
        business.licence = licence;

        const licenceCollection: ILicence[] = [{ id: 'Cloned Bedfordshire Tunnel' }];
        spyOn(licenceService, 'query').and.returnValue(of(new HttpResponse({ body: licenceCollection })));
        const additionalLicences = [licence];
        const expectedCollection: ILicence[] = [...additionalLicences, ...licenceCollection];
        spyOn(licenceService, 'addLicenceToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ business });
        comp.ngOnInit();

        expect(licenceService.query).toHaveBeenCalled();
        expect(licenceService.addLicenceToCollectionIfMissing).toHaveBeenCalledWith(licenceCollection, ...additionalLicences);
        expect(comp.licencesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const business: IBusiness = { id: 456 };
        const licence: ILicence = { id: 'Kentucky online Borders' };
        business.licence = licence;

        activatedRoute.data = of({ business });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(business));
        expect(comp.licencesSharedCollection).toContain(licence);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const business = { id: 123 };
        spyOn(businessService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ business });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: business }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(businessService.update).toHaveBeenCalledWith(business);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const business = new Business();
        spyOn(businessService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ business });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: business }));
        saveSubject.complete();

        // THEN
        expect(businessService.create).toHaveBeenCalledWith(business);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const business = { id: 123 };
        spyOn(businessService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ business });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(businessService.update).toHaveBeenCalledWith(business);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLicenceById', () => {
        it('Should return tracked Licence primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackLicenceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
