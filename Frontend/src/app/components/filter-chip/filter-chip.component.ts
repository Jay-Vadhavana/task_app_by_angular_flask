import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-filter-chip',
  imports: [MatIcon],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.css'
})
export class FilterChipComponent {
  @Input() label: string = '';
  @Input() value: string = '';

  @Output() removeDateFilter = new EventEmitter<void>();

  removeFilter() {
     console.log(`Removing filter: ${this.label} = ${this.value}`);
    this.removeDateFilter.emit();
  }
}
