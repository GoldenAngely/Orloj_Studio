import { Component, inject, signal } from '@angular/core';
import { GeneralService } from '../../core/services/general-service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-mapping-practice1',
  imports: [JsonPipe],
  standalone: true,
  templateUrl: './mapping-practice1.html',
  styleUrl: './mapping-practice1.scss',
})
export class MappingPractice1 {
  private readonly catalogsService = inject(GeneralService);

  workSchemes = signal<unknown[]>([]);
  teams = signal<unknown[]>([]);
  ous = signal<unknown[]>([]);
  shifts = signal<unknown[]>([]);
  stations = signal<unknown[]>([]);

  ngOnInit(): void {
    this.catalogsService.getWorkSchemes()
      .subscribe(data => this.workSchemes.set(data));

    this.catalogsService.getTeams()
      .subscribe(data => this.teams.set(data));

    this.catalogsService.getOus()
      .subscribe(data => this.ous.set(data));

    this.catalogsService.getShifts()
      .subscribe(data => this.shifts.set(data));

    this.catalogsService.getStations()
      .subscribe(data => this.stations.set(data));
  }

  getColumns(data: unknown[]): string[] {
    const firstItem = data[0];

    if (!firstItem || typeof firstItem !== 'object') {
      return [];
    }

    return Object.keys(firstItem);
  }

  getValue(row: unknown, column: string): unknown {
    if (!row || typeof row !== 'object') {
      return '';
    }

    return (row as Record<string, unknown>)[column];
  }
}