// features/catalogs/services/catalogs.service.ts
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';


@Injectable({ providedIn: 'root' })
export class GeneralService {
  private readonly api = inject(ApiService);

  getWorkSchemes(): Observable<unknown[]> {
    return this.api.get<unknown[]>(API_ENDPOINTS.workScheme.getAll);
  }

  getTeams(): Observable<unknown[]> {
    return this.api.get<unknown[]>(API_ENDPOINTS.teamProd.getAll);
  }

  getOus(): Observable<unknown[]> {
    return this.api.get<unknown[]>(API_ENDPOINTS.ouProd.getAll);
  }

  getShifts(): Observable<unknown[]> {
    return this.api.get<unknown[]>(API_ENDPOINTS.shiftSchedule.getAll);
  }

  getStations(): Observable<unknown[]> {
    return this.api.get<unknown[]>(API_ENDPOINTS.stationData.getAll);
  }
}