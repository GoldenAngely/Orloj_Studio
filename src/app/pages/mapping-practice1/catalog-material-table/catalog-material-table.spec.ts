import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMaterialTable } from './catalog-material-table';

describe('CatalogMaterialTable', () => {
  let component: CatalogMaterialTable;
  let fixture: ComponentFixture<CatalogMaterialTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogMaterialTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogMaterialTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
