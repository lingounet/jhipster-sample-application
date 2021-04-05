jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDemand, Demand } from '../demand.model';
import { DemandService } from '../service/demand.service';

import { DemandRoutingResolveService } from './demand-routing-resolve.service';

describe('Service Tests', () => {
  describe('Demand routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DemandRoutingResolveService;
    let service: DemandService;
    let resultDemand: IDemand | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DemandRoutingResolveService);
      service = TestBed.inject(DemandService);
      resultDemand = undefined;
    });

    describe('resolve', () => {
      it('should return IDemand returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDemand = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDemand).toEqual({ id: 123 });
      });

      it('should return new IDemand if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDemand = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDemand).toEqual(new Demand());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDemand = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDemand).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
