import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ARABIC_TRANSLATIONS } from '../constants/translations';

@Injectable()
export class LocalizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const acceptLanguage = request.headers['accept-language'];

    // Only translate if language is Arabic
    if (acceptLanguage && acceptLanguage.includes('ar')) {
      return next.handle().pipe(map((data) => this.translateResponse(data)));
    }

    return next.handle();
  }

  private translateResponse(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.translateResponse(item));
    }

    if (typeof data === 'object' && !(data instanceof Date)) {
      const translatedData = { ...data };

      // Swap bilingual notification fields: use Arabic if available
      if (translatedData.titleAr) {
        translatedData.title = translatedData.titleAr;
      }
      if (translatedData.messageAr) {
        translatedData.message = translatedData.messageAr;
      }

      for (const key in translatedData) {
        if (Object.prototype.hasOwnProperty.call(translatedData, key)) {
          const value = translatedData[key];

          if (typeof value === 'string') {
            // Check if exact match exists in dictionary
            if (ARABIC_TRANSLATIONS[value]) {
              translatedData[key] = ARABIC_TRANSLATIONS[value];
            }
            // Optional: Partial matching or case-insensitive could be added here
            // but exact match is safer for Enums.
            else if (ARABIC_TRANSLATIONS[value.toUpperCase()]) {
              translatedData[key] = ARABIC_TRANSLATIONS[value.toUpperCase()];
            }
          } else if (typeof value === 'object' && value !== null) {
            translatedData[key] = this.translateResponse(value);
          }
        }
      }
      return translatedData;
    }

    return data;
  }
}
