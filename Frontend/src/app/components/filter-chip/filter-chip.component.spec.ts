import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChipComponent } from './filter-chip.component';

describe('FilterChipComponent', () => {
  let component: FilterChipComponent;
  let fixture: ComponentFixture<FilterChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
