import { CommonModule, JsonPipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild,} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableRow } from '../../../interfaces/general-interfaces';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-catalog-material-table',
  standalone: true,
  imports: [CommonModule, JsonPipe, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './catalog-material-table.html',
  styleUrl: './catalog-material-table.scss',
})
export class CatalogMaterialTable implements OnChanges, AfterViewInit {
  @Input() columns: string[] = [];
  @Input() rows: TableRow[] = [];

  dataSource = new MatTableDataSource<TableRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows'] || changes['columns']) {
      this.dataSource.data = this.rows ?? [];

      this.dataSource.filterPredicate = (row: TableRow, filter: string) => {
        const normalizedFilter = filter.trim().toLowerCase();

        return this.columns.some((column) => {
          const value = this.getValue(row, column);

          if (value === null || value === undefined) {
            return false;
          }

          const textValue = this.isObject(value)
            ? JSON.stringify(value)
            : String(value);

          return textValue.toLowerCase().includes(normalizedFilter);
        });
      };
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (row: TableRow, column: string) => {
      const value = this.getValue(row, column);

      if (value === null || value === undefined) {
        return '';
      }

      if (typeof value === 'number') {
        return value;
      }

      return String(value).toLowerCase();
    };
  }

  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.dataSource.filter = input.value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

isBoolean(value: unknown): boolean {
  return typeof value === 'boolean';
}

formatColumnName(column: string): string {
  return column
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (text) => text.toUpperCase())
    .trim();
}

  clearFilter(input: HTMLInputElement): void {
  input.value = '';
  this.dataSource.filter = '';
  this.dataSource.paginator?.firstPage();
}

  getValue(row: TableRow, column: string): unknown {
    return row[column];
  }

  isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null;
  }

  getColumnIcon(column: string): string {
  const normalizedColumn = column.toLowerCase();

  if (normalizedColumn.includes('id')) {
    return 'tag';
  }

  if (normalizedColumn.includes('description')) {
    return 'notes';
  }

  if (normalizedColumn.includes('start')) {
    return 'schedule';
  }

  if (normalizedColumn.includes('end')) {
    return 'event_available';
  }

  if (normalizedColumn.includes('active')) {
    return 'verified';
  }

  return 'view_column';
}

}