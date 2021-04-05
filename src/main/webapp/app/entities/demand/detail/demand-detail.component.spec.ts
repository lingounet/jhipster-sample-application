import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DemandDetailComponent } from './demand-detail.component';

describe('Component Tests', () => {
  describe('Demand Management Detail Component', () => {
    let comp: DemandDetailComponent;
    let fixture: ComponentFixture<DemandDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DemandDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ demand: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DemandDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DemandDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load demand on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.demand).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
