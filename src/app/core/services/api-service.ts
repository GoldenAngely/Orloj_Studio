import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<TResponse>(endpoint: string, params?: QueryParams): Observable<TResponse> {
  return this.http.get<TResponse>(
    this.buildUrl(endpoint),
    {
      params: this.buildParams(params)
    }
  );
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
