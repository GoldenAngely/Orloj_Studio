import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import {
  WorkScheme,
  TeamProd,
  OuProd,
  ShiftSchedule,
} from '../../interfaces/general-interfaces';

@Injectable({ providedIn: 'root' })
export class GeneralService {
  private readonly api = inject(ApiService);

  getWorkSchemes(): Observable<WorkScheme[]> {
    return this.api.get<WorkScheme[]>(API_ENDPOINTS.workScheme.getAll);
  }

  getTeams(): Observable<TeamProd[]> {
    return this.api.get<TeamProd[]>(API_ENDPOINTS.teamProd.getAll);
  }

  getOus(): Observable<OuProd[]> {
    return this.api.get<OuProd[]>(API_ENDPOINTS.ouProd.getAll);
  }

  getShifts(): Observable<ShiftSchedule[]> {
    return this.api.get<ShiftSchedule[]>(API_ENDPOINTS.shiftSchedule.getAll);
  }
}