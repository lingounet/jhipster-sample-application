import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessDetailComponent } from './business-detail.component';

describe('Component Tests', () => {
  describe('Business Management Detail Component', () => {
    let comp: BusinessDetailComponent;
    let fixture: ComponentFixture<BusinessDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BusinessDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ business: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BusinessDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BusinessDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load business on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.business).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
