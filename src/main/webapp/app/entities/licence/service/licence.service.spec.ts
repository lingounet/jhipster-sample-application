import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILicence, Licence } from '../licence.model';

import { LicenceService } from './licence.service';

describe('Service Tests', () => {
  describe('Licence Service', () => {
    let service: LicenceService;
    let httpMock: HttpTestingController;
    let elemDefault: ILicence;
    let expectedResult: ILicence | ILicence[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LicenceService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        price: 0,
        reference: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Licence', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Licence()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Licence', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            price: 1,
            reference: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Licence', () => {
        const patchObject = Object.assign({}, new Licence());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Licence', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            price: 1,
            reference: 'BBBBBB',
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

      it('should delete a Licence', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLicenceToCollectionIfMissing', () => {
        it('should add a Licence to an empty array', () => {
          const licence: ILicence = { id: 'ABC' };
          expectedResult = service.addLicenceToCollectionIfMissing([], licence);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(licence);
        });

        it('should not add a Licence to an array that contains it', () => {
          const licence: ILicence = { id: 'ABC' };
          const licenceCollection: ILicence[] = [
            {
              ...licence,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addLicenceToCollectionIfMissing(licenceCollection, licence);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Licence to an array that doesn't contain it", () => {
          const licence: ILicence = { id: 'ABC' };
          const licenceCollection: ILicence[] = [{ id: 'CBA' }];
          expectedResult = service.addLicenceToCollectionIfMissing(licenceCollection, licence);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(licence);
        });

        it('should add only unique Licence to an array', () => {
          const licenceArray: ILicence[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'turquoise' }];
          const licenceCollection: ILicence[] = [{ id: 'ABC' }];
          expectedResult = service.addLicenceToCollectionIfMissing(licenceCollection, ...licenceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const licence: ILicence = { id: 'ABC' };
          const licence2: ILicence = { id: 'CBA' };
          expectedResult = service.addLicenceToCollectionIfMissing([], licence, licence2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(licence);
          expect(expectedResult).toContain(licence2);
        });

        it('should accept null and undefined values', () => {
          const licence: ILicence = { id: 'ABC' };
          expectedResult = service.addLicenceToCollectionIfMissing([], null, licence, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(licence);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
