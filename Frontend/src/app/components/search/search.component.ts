import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  standalone: true
})
export class SearchComponent {
  @Output() searchChange = new EventEmitter<string>();

  onInput(event: any) {
    this.searchChange.emit(event.target.value);
  }
}
