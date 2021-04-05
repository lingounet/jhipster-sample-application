jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILicence, Licence } from '../licence.model';
import { LicenceService } from '../service/licence.service';

import { LicenceRoutingResolveService } from './licence-routing-resolve.service';

describe('Service Tests', () => {
  describe('Licence routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LicenceRoutingResolveService;
    let service: LicenceService;
    let resultLicence: ILicence | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LicenceRoutingResolveService);
      service = TestBed.inject(LicenceService);
      resultLicence = undefined;
    });

    describe('resolve', () => {
      it('should return ILicence returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLicence = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultLicence).toEqual({ id: 'ABC' });
      });

      it('should return new ILicence if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLicence = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLicence).toEqual(new Licence());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLicence = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultLicence).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
