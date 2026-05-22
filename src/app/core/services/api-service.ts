import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../interfaces/general-interfaces';


type QueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<TResponse>(
    endpoint: string,
    params?: QueryParams
  ): Observable<TResponse> {
    return this.http
      .get<ApiResponse<TResponse>>(this.buildUrl(endpoint), {
        params: this.buildParams(params),
      })
      .pipe(map(response => response.result));
  }

  private buildUrl(endpoint: string): string {
    const cleanBase = this.baseUrl.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');

    return `${cleanBase}/${cleanEndpoint}`;
  }

  private buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }
}