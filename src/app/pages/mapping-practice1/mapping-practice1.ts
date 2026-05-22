import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { catchError, finalize, of, Observable } from 'rxjs';
import { GeneralService } from '../../core/services/general-service';
import { CatalogTable, TableRow } from '../../interfaces/general-interfaces';

@Component({
  selector: 'app-mapping-practice1',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  templateUrl: './mapping-practice1.html',
  styleUrl: './mapping-practice1.scss',
})
export class MappingPractice1 {
  private readonly catalogsService = inject(GeneralService);

  catalogs = signal<CatalogTable[]>([
    this.createEmptyTable('Work Schemes'),
    this.createEmptyTable('Teams'),
    this.createEmptyTable('OUs'),
    this.createEmptyTable('Shifts'),
  ]);

  ngOnInit(): void {
    this.loadCatalog(0, this.catalogsService.getWorkSchemes());
    this.loadCatalog(1, this.catalogsService.getTeams());
    this.loadCatalog(2, this.catalogsService.getOus());
    this.loadCatalog(3, this.catalogsService.getShifts());
  }

  private loadCatalog<TItem extends object>(index: number, request$: Observable<TItem[]>): void {
    this.updateCatalog(index, { loading: true, error: null });
    request$
      .pipe(
        catchError((error) => {
          console.error('Catalog error:', error);

          this.updateCatalog(index, {
            error: 'No se pudo cargar este catálogo.',
            rows: [],
            columns: [],
          });

          return of([]);
        }),
        finalize(() => {
          this.updateCatalog(index, { loading: false });
        }),
      )
      .subscribe((data) => {
        const rows = data as TableRow[];
        this.updateCatalog(index, {
          rows,
          columns: this.getColumns(rows),
        });
      });
  }

  private createEmptyTable(title: string): CatalogTable {
    return { title, rows: [], columns: [], loading: false, error: null };
  }

  private updateCatalog(index: number, changes: Partial<CatalogTable>): void {
    this.catalogs.update((catalogs) =>
      catalogs.map((catalog, currentIndex) =>
        currentIndex === index ? { ...catalog, ...changes } : catalog,
      ),
    );
  }

  getValue(row: TableRow, column: string): unknown {
    return row[column];
  }

  isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null;
  }

  private getColumns(rows: TableRow[]): string[] {
    return rows.length > 0 ? Object.keys(rows[0]) : [];
  }
}
