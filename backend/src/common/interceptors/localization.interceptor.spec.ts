import { LocalizationInterceptor } from './localization.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LocalizationInterceptor', () => {
  let interceptor: LocalizationInterceptor;

  beforeEach(() => {
    interceptor = new LocalizationInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should translate DAILY to Arabic when Accept-Language is ar', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'accept-language': 'ar' },
        }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ frequency: 'DAILY' }),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({ frequency: 'يومي' });
      done();
    });
  });

  it('should NOT translate when Accept-Language is en', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'accept-language': 'en' },
        }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ frequency: 'DAILY' }),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({ frequency: 'DAILY' });
      done();
    });
  });

  it('should translate nested objects', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'accept-language': 'ar' },
        }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () =>
        of({
          nested: { status: 'PENDING' },
          array: [{ priority: 'HIGH' }],
        }),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({
        nested: { status: 'قيد الانتظار' },
        array: [{ priority: 'عالي' }],
      });
      done();
    });
  });

  it('should ignore values not in dictionary', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'accept-language': 'ar' },
        }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ name: 'Some Name' }),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({ name: 'Some Name' });
      done();
    });
  });
});
