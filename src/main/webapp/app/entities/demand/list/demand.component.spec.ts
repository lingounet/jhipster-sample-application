import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DemandService } from '../service/demand.service';

import { DemandComponent } from './demand.component';

describe('Component Tests', () => {
  describe('Demand Management Component', () => {
    let comp: DemandComponent;
    let fixture: ComponentFixture<DemandComponent>;
    let service: DemandService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DemandComponent],
      })
        .overrideTemplate(DemandComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DemandComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DemandService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.demands?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
