import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Status } from 'app/entities/enumerations/status.model';
import { IDemand, Demand } from '../demand.model';

import { DemandService } from './demand.service';

describe('Service Tests', () => {
  describe('Demand Service', () => {
    let service: DemandService;
    let httpMock: HttpTestingController;
    let elemDefault: IDemand;
    let expectedResult: IDemand | IDemand[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DemandService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        status: Status.DRAFT,
        email: 'AAAAAAA',
        number: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Demand', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Demand()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Demand', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            status: 'BBBBBB',
            email: 'BBBBBB',
            number: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Demand', () => {
        const patchObject = Object.assign(
          {
            number: 1,
          },
          new Demand()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Demand', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            status: 'BBBBBB',
            email: 'BBBBBB',
            number: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Demand', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDemandToCollectionIfMissing', () => {
        it('should add a Demand to an empty array', () => {
          const demand: IDemand = { id: 123 };
          expectedResult = service.addDemandToCollectionIfMissing([], demand);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(demand);
        });

        it('should not add a Demand to an array that contains it', () => {
          const demand: IDemand = { id: 123 };
          const demandCollection: IDemand[] = [
            {
              ...demand,
            },
            { id: 456 },
          ];
          expectedResult = service.addDemandToCollectionIfMissing(demandCollection, demand);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Demand to an array that doesn't contain it", () => {
          const demand: IDemand = { id: 123 };
          const demandCollection: IDemand[] = [{ id: 456 }];
          expectedResult = service.addDemandToCollectionIfMissing(demandCollection, demand);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(demand);
        });

        it('should add only unique Demand to an array', () => {
          const demandArray: IDemand[] = [{ id: 123 }, { id: 456 }, { id: 73866 }];
          const demandCollection: IDemand[] = [{ id: 123 }];
          expectedResult = service.addDemandToCollectionIfMissing(demandCollection, ...demandArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const demand: IDemand = { id: 123 };
          const demand2: IDemand = { id: 456 };
          expectedResult = service.addDemandToCollectionIfMissing([], demand, demand2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(demand);
          expect(expectedResult).toContain(demand2);
        });

        it('should accept null and undefined values', () => {
          const demand: IDemand = { id: 123 };
          expectedResult = service.addDemandToCollectionIfMissing([], null, demand, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(demand);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
