import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RoleService } from '../service/role.service';

import { RoleComponent } from './role.component';

describe('Component Tests', () => {
  describe('Role Management Component', () => {
    let comp: RoleComponent;
    let fixture: ComponentFixture<RoleComponent>;
    let service: RoleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RoleComponent],
      })
        .overrideTemplate(RoleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoleComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RoleService);

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
      expect(comp.roles?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
