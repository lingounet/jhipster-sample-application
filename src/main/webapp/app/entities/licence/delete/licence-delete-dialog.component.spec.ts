jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LicenceService } from '../service/licence.service';

import { LicenceDeleteDialogComponent } from './licence-delete-dialog.component';

describe('Component Tests', () => {
  describe('Licence Management Delete Component', () => {
    let comp: LicenceDeleteDialogComponent;
    let fixture: ComponentFixture<LicenceDeleteDialogComponent>;
    let service: LicenceService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LicenceDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(LicenceDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LicenceDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LicenceService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('ABC');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('ABC');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
