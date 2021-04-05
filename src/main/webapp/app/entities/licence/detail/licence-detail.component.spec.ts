import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LicenceDetailComponent } from './licence-detail.component';

describe('Component Tests', () => {
  describe('Licence Management Detail Component', () => {
    let comp: LicenceDetailComponent;
    let fixture: ComponentFixture<LicenceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LicenceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ licence: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(LicenceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LicenceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load licence on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.licence).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
