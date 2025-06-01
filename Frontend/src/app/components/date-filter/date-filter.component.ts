import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-filter',
  imports: [MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule,
  ReactiveFormsModule, CommonModule],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.css'
})
export class DateFilterComponent {

  @Input() anchor: HTMLElement | null = null;
  dateFilterStyle: any = {};
  startDate:string = '';
  endDate:string = '';

  @Output() dateRangeChange = new EventEmitter<{ startDate: string, endDate: string }>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.startDate = '';
    this.endDate = '';
  }

  ngAfterViewInit() {
    if (this.anchor) {
      const rect = this.anchor.getBoundingClientRect();
      this.dateFilterStyle = {
        position: 'absolute',
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        minWidth: `${rect.width}px`,
        zIndex: 1000
      };
      this.cdr.detectChanges();
    }
  }

  onDateRangeChange(event: any, type: string) {
    if(type === 'start') 
      this.startDate = event.value ? event.value.toISOString() : '';
    else
      this.endDate = event.value ? event.value.toISOString() : '';
    
    if(this.startDate && this.endDate) {
      this.dateRangeChange.emit({ startDate: this.startDate, endDate: this.endDate });
    }
  }
}
